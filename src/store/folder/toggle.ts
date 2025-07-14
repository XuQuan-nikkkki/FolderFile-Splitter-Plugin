import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_EXPANDED_FOLDER_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

export interface ToggleFolderSlice {
	expandedFolderPaths: string[];

	isFolderExpanded: (folder: TFolder) => boolean;
	hasFolderExpanded: () => boolean;
	canFolderToggle: (folder: TFolder) => boolean;

	changeExpandedFolderPaths: (folderPaths: string[]) => void;
	expandFolder: (folder: TFolder) => void;
	expandAllFolders: () => void;
	collapseFolder: (folder: TFolder) => void;
	collapseAllFolders: () => void;
	toggleFolder: (folder: TFolder) => void;
	expandAncestors: (folder: TFolder) => void;

	restoreExpandedFolderPaths: () => void;
}

export const createToggleFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ToggleFolderSlice> =>
	(set, get) => ({
		expandedFolderPaths: [],

		isFolderExpanded: (folder: TFolder) => {
			return get().expandedFolderPaths.includes(folder.path);
		},
		hasFolderExpanded: () => {
			const { expandedFolderPaths } = get();
			return (
				plugin.settings.showFolderView && expandedFolderPaths.length > 0
			);
		},
		canFolderToggle: (folder: TFolder): boolean => {
			const { hasSubFolder } = get();
			// root folder is always expanded
			return !folder.isRoot() && hasSubFolder(folder);
		},

		changeExpandedFolderPaths: (folderPaths: string[]) => {
			const { setValueAndSaveInLocalStorage } = get();
			const paths = uniq(folderPaths);
			setValueAndSaveInLocalStorage({
				key: "expandedFolderPaths",
				value: paths,
				localStorageKey: FFS_EXPANDED_FOLDER_PATHS_KEY,
				localStorageValue: JSON.stringify(paths),
			});
		},
		expandFolder: (folder: TFolder) => {
			const {
				changeExpandedFolderPaths,
				expandedFolderPaths,
				canFolderToggle,
			} = get();
			if (!canFolderToggle(folder)) return;
			changeExpandedFolderPaths([...expandedFolderPaths, folder.path]);
		},
		expandAllFolders: () => {
			const { folders, changeExpandedFolderPaths } = get();
			changeExpandedFolderPaths(folders.map((f) => f.path));
		},
		collapseFolder: (folder: TFolder) => {
			const {
				changeExpandedFolderPaths,
				expandedFolderPaths,
				canFolderToggle,
			} = get();
			if (!canFolderToggle(folder)) return;
			changeExpandedFolderPaths(
				removeItemFromArray(expandedFolderPaths, folder.path)
			);
		},
		collapseAllFolders: () => {
			get().changeExpandedFolderPaths([]);
		},
		toggleFolder: (folder: TFolder) => {
			const { isFolderExpanded, expandFolder, collapseFolder } = get();
			if (isFolderExpanded(folder)) {
				collapseFolder(folder);
			} else {
				expandFolder(folder);
			}
		},
		expandAncestors: (folder: TFolder) => {
			const { getAncestors, expandFolder } = get();
			const ancestors = getAncestors(folder);
			ancestors.forEach(expandFolder);
		},

		restoreExpandedFolderPaths: () => {
			const {
				hasSubFolder,
				restoreDataFromLocalStorage,
				findFolderByPath,
			} = get();
			restoreDataFromLocalStorage({
				localStorageKey: FFS_EXPANDED_FOLDER_PATHS_KEY,
				key: "expandedFolderPaths",
				needParse: true,
				transform: (value) => {
					return (value as string[]).filter((path) => {
						const folder = findFolderByPath(path);
						return folder && hasSubFolder(folder);
					});
				},
			});
		},
	});
