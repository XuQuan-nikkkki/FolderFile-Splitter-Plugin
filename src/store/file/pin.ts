import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FILE_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface PinnedFileSlice {
	pinnedFilePaths: string[];

	getPinnedFiles: () => TFile[];
	getDisplayedPinnedFiles: () => TFile[];

	isFilePinned: (file: TFile) => boolean;

	setPinnedFilePathsAndSave: (paths: string[]) => Promise<void>;

	pinFile: (file: TFile) => Promise<void>;
	unpinFile: (file: TFile) => Promise<void>;
	updatePinnedFilePath: (oldPath: string, newPath: string) => Promise<void>;

	restorePinnedFiles: () => Promise<void>;
}

export const createPinnedFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinnedFileSlice> =>
	(set, get) => ({
		pinnedFilePaths: [],

		getPinnedFiles: () => {
			const { getFiles, pinnedFilePaths, getPinnedItems } = get();
			return getPinnedItems<TFile>(pinnedFilePaths, (path) =>
				getFiles().find((file) => file.path === path)
			);
		},
		getDisplayedPinnedFiles: () => {
			const { getVisibleFiles, getPinnedFiles } = get();
			const visibleFiles = getVisibleFiles();
			const pinnedFiles = getPinnedFiles();
			return pinnedFiles.filter((file) =>
				visibleFiles.some((f) => f.path === file.path)
			);
		},

		isFilePinned: (file: TFile) => {
			const { pinnedFilePaths, isPinned } = get();
			return isPinned(pinnedFilePaths, file.path);
		},

		setPinnedFilePathsAndSave: async (filePaths: string[]) => {
			await get().setPinnedPathsAndSave(
				"pinnedFilePaths",
				FFS_PINNED_FILE_PATHS_KEY,
				filePaths
			);
		},

		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave, pinItem } =
				get();
			await pinItem(
				file.path,
				pinnedFilePaths,
				setPinnedFilePathsAndSave
			);
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave, unpinItem } =
				get();
			await unpinItem(
				file.path,
				pinnedFilePaths,
				setPinnedFilePathsAndSave
			);
		},
		updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const {
				pinnedFilePaths,
				setPinnedFilePathsAndSave,
				updatePinnedPath,
			} = get();
			await updatePinnedPath(
				oldPath,
				newPath,
				pinnedFilePaths,
				setPinnedFilePathsAndSave
			);
		},

		restorePinnedFiles: async () => {
			await get().restorePinnedPaths(
				"pinnedFilePaths",
				FFS_PINNED_FILE_PATHS_KEY
			);
		},
	});
