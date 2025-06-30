import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FOLDER_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

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
			const { folders, pinnedFolderPaths, getPinnedItems } = get();
			return getPinnedItems<TFolder>(pinnedFolderPaths, (path) =>
				folders.find((folder) => folder.path === path)
			);
		},
		getDisplayedPinnedFolders: () => {
			const { showFolderView } = plugin.settings;
			const { getPinnedFolders } = get();
			if (!showFolderView) return [];
			return getPinnedFolders();
		},

		isFolderPinned: (folder: TFolder) => {
			const { pinnedFolderPaths, isPinned } = get();
			return isPinned(pinnedFolderPaths, folder.path);
		},

		setPinnedFolderPathsAndSave: async (folderPaths: string[]) => {
			await get().setPinnedPathsAndSave(
				"pinnedFolderPaths",
				FFS_PINNED_FOLDER_PATHS_KEY,
				folderPaths
			);
		},

		pinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, setPinnedFolderPathsAndSave, pinItem } =
				get();
			await pinItem(
				folder.path,
				pinnedFolderPaths,
				setPinnedFolderPathsAndSave
			);
		},
		unpinFolder: async (folder: TFolder) => {
			const {
				pinnedFolderPaths,
				setPinnedFolderPathsAndSave,
				unpinItem,
			} = get();
			await unpinItem(
				folder.path,
				pinnedFolderPaths,
				setPinnedFolderPathsAndSave
			);
		},
		updatePinnedFolderPath: async (oldPath: string, newPath: string) => {
			const {
				pinnedFolderPaths,
				setPinnedFolderPathsAndSave,
				updatePinnedPath,
			} = get();
			await updatePinnedPath(
				oldPath,
				newPath,
				pinnedFolderPaths,
				setPinnedFolderPathsAndSave
			);
		},

		restorePinnedFolders: async () => {
			await get().restorePinnedPaths(
				"pinnedFolderPaths",
				FFS_PINNED_FOLDER_PATHS_KEY
			);
		},
	});
