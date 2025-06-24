import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FOLDER_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, replaceItemInArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

export interface PinnedFolderSlice {
	pinnedFolderPaths: string[];

	getPinnedFolders: () => TFolder[];
	getDisplayedPinnedFolders: () => TFolder[];

	isFolderPinned: (folder: TFolder) => boolean;

	setPinnedFolderPathsAndSave: (paths: string[]) => Promise<void>;

	pinFolder: (folder: TFolder) => Promise<void>;
	unpinFolder: (folder: TFolder) => Promise<void>;
	updatePinnedFolderPath: (oldPath: string, newPath: string) => Promise<void>;

	restorePinnedFolders: () => Promise<void>;
}

export const createPinnedFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinnedFolderSlice> =>
	(set, get) => ({
		pinnedFolderPaths: [],

		getPinnedFolders: () => {
			const { folders, pinnedFolderPaths } = get();
			return uniq(pinnedFolderPaths)
				.map((path) => folders.find((folder) => folder.path === path))
				.filter(Boolean) as TFolder[];
		},
		getDisplayedPinnedFolders: () => {
			const { showFolderView } = plugin.settings;
			const { getPinnedFolders } = get();
			if (!showFolderView) return [];
			return getPinnedFolders();
		},

		isFolderPinned: (folder: TFolder) => {
			const { pinnedFolderPaths } = get();
			return pinnedFolderPaths.includes(folder.path);
		},

		setPinnedFolderPathsAndSave: async (folderPaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			const paths = uniq(folderPaths);
			await setValueAndSaveInPlugin({
				key: "pinnedFolderPaths",
				value: paths,
				pluginKey: FFS_PINNED_FOLDER_PATHS_KEY,
				pluginValue: JSON.stringify(paths),
			});
		},

		pinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, setPinnedFolderPathsAndSave } = get();
			if (pinnedFolderPaths.includes(folder.path)) return;
			const folderPaths = [...pinnedFolderPaths, folder.path];
			await setPinnedFolderPathsAndSave(folderPaths);
		},
		unpinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, setPinnedFolderPathsAndSave } = get();
			if (!pinnedFolderPaths.includes(folder.path)) return;
			const folderPaths = removeItemFromArray(
				pinnedFolderPaths,
				folder.path
			);
			await setPinnedFolderPathsAndSave(folderPaths);
		},
		updatePinnedFolderPath: async (oldPath: string, newPath: string) => {
			const { pinnedFolderPaths, setPinnedFolderPathsAndSave } = get();
			if (!pinnedFolderPaths.includes(oldPath)) return;
			const updatedPaths = replaceItemInArray(
				pinnedFolderPaths,
				oldPath,
				newPath
			);
			await setPinnedFolderPathsAndSave(updatedPaths);
		},

		restorePinnedFolders: async () => {
			const { restoreDataFromPlugin } = get();
			await restoreDataFromPlugin({
				pluginKey: FFS_PINNED_FOLDER_PATHS_KEY,
				key: "pinnedFolderPaths",
				needParse: true,
			});
		},
	});
