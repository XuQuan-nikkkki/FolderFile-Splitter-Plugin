import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FOLDER_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, replaceItemInArray } from "src/utils";

import { ExplorerStore } from "..";

export interface PinnedFolderSlice {
	pinnedFolderPaths: string[];

	_updatePinnedFolderPaths: (paths: string[]) => Promise<void>;
	pinFolder: (folder: TFolder) => Promise<void>;
	unpinFolder: (folder: TFolder) => Promise<void>;
	isFolderPinned: (folder: TFolder) => boolean;
	restorePinnedFolders: () => Promise<void>;
	updateFolderPinState: (oldPath: string, newPath: string) => Promise<void>;
}

export const createPinnedFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinnedFolderSlice> =>
	(set, get) => ({
		pinnedFolderPaths: [],

		isFolderPinned: (folder: TFolder) => {
			const { pinnedFolderPaths } = get();
			return pinnedFolderPaths.includes(folder.path);
		},
		_updatePinnedFolderPaths: async (folderPaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "pinnedFolderPaths",
				value: folderPaths,
				pluginKey: FFS_PINNED_FOLDER_PATHS_KEY,
				pluginValue: JSON.stringify(folderPaths),
			});
		},
		pinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			if (pinnedFolderPaths.includes(folder.path)) return;
			const folderPaths = [...pinnedFolderPaths, folder.path];
			await _updatePinnedFolderPaths(folderPaths);
		},
		unpinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			if (!pinnedFolderPaths.includes(folder.path)) return;
			const folderPaths = removeItemFromArray(
				pinnedFolderPaths,
				folder.path
			);
			await _updatePinnedFolderPaths(folderPaths);
		},
		restorePinnedFolders: async () => {
			const { restoreDataFromPlugin } = get();
			await restoreDataFromPlugin({
				pluginKey: FFS_PINNED_FOLDER_PATHS_KEY,
				key: "pinnedFolderPaths",
				needParse: true,
			});
		},
		updateFolderPinState: async (oldPath: string, newPath: string) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			if (!pinnedFolderPaths.includes(oldPath)) return;
			const updatedPaths = replaceItemInArray(
				pinnedFolderPaths,
				oldPath,
				newPath
			);
			await _updatePinnedFolderPaths(updatedPaths);
		},
	});
