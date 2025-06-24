import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FOLDER_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface PinnedFolderSlice {
	pinnedFolderPaths: string[];

	_updatePinnedFolderPaths: (paths: string[]) => Promise<void>;
	pinFolder: (folder: TFolder) => Promise<void>;
	unpinFolder: (folder: TFolder) => Promise<void>;
	isFolderPinned: (folder: TFolder) => boolean;
	restorePinnedFolders: () => Promise<void>;
	_updatePinnedFolderPath: (
		oldPath: string,
		newPath: string
	) => Promise<void>;
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
			const folderPaths = pinnedFolderPaths.filter(
				(path) => path !== folder.path
			);
			await _updatePinnedFolderPaths(folderPaths);
		},
		restorePinnedFolders: async () => {
			const { getDataFromPlugin: getData } = get();
			const pinnedFolderPaths = await getData<string>(
				FFS_PINNED_FOLDER_PATHS_KEY
			);
			if (pinnedFolderPaths) {
				try {
					const folderPaths: string[] = JSON.parse(pinnedFolderPaths);
					set({
						pinnedFolderPaths: folderPaths,
					});
				} catch (error) {
					console.error("Invalid Json format: ", error);
				}
			}
		},
		_updatePinnedFolderPath: async (oldPath: string, newPath: string) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			if (!pinnedFolderPaths.includes(oldPath)) return;

			const pinnedIndex = pinnedFolderPaths.indexOf(oldPath);
			const paths = [...pinnedFolderPaths];
			paths.splice(pinnedIndex, 1, newPath);
			await _updatePinnedFolderPaths(paths);
		},
		updateFolderPinState: async (oldPath: string, newPath: string) => {
			const { pinnedFolderPaths, _updatePinnedFolderPath } = get();
			if (!pinnedFolderPaths.includes(oldPath)) return;
			await _updatePinnedFolderPath(oldPath, newPath);
		},
	});
