import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_EXPANDED_FOLDER_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { uniq } from "src/utils";

import { ExplorerStore } from "..";

export interface ToggleFolderSlice {
	expandedFolderPaths: string[];

	canFolderToggle: (folder: TFolder) => boolean;
	changeExpandedFolderPaths: (folderNames: string[]) => Promise<void>;
	restoreExpandedFolderPaths: () => Promise<void>;
	expandFolder: (folder: TFolder) => Promise<void>;
	collapseFolder: (folder: TFolder) => Promise<void>;
}

export const createToggleFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ToggleFolderSlice> =>
	(set, get) => ({
		expandedFolderPaths: [],

		canFolderToggle: (folder: TFolder): boolean => {
			const { hasSubFolders } = get();
			// root folder is always expanded
			return !folder.isRoot() && hasSubFolders(folder);
		},

		expandFolder: async (folder: TFolder) => {
			const {
				changeExpandedFolderPaths,
				expandedFolderPaths,
				canFolderToggle,
			} = get();
			if (!canFolderToggle(folder)) return;
			await changeExpandedFolderPaths(
				uniq([...expandedFolderPaths, folder.path])
			);
		},
		collapseFolder: async (folder: TFolder) => {
			const {
				changeExpandedFolderPaths,
				expandedFolderPaths,
				canFolderToggle,
			} = get();
			if (!canFolderToggle(folder)) return;
			await changeExpandedFolderPaths(
				expandedFolderPaths.filter((path) => path !== folder.path)
			);
		},
		changeExpandedFolderPaths: async (folderPaths: string[]) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "expandedFolderPaths",
				value: folderPaths,
				localStorageKey: FFS_EXPANDED_FOLDER_PATHS_KEY,
				localStorageValue: JSON.stringify(folderPaths),
			});
		},
		restoreExpandedFolderPaths: async () => {
			const { getDataFromLocalStorage, hasSubFolders } = get();
			const lastExpandedFolderPaths = getDataFromLocalStorage(
				FFS_EXPANDED_FOLDER_PATHS_KEY
			);
			if (!lastExpandedFolderPaths) return;
			try {
				const folderPaths: string[] = JSON.parse(
					lastExpandedFolderPaths
				);
				set({
					expandedFolderPaths: folderPaths.filter((path) => {
						const folder = plugin.app.vault.getFolderByPath(path);
						return folder && hasSubFolders(folder);
					}),
				});
			} catch (error) {
				console.error("Invalid Json format: ", error);
			}
		},
	});
