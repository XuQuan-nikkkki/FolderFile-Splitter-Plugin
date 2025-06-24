import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FILE_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, replaceItemInArray, uniq } from "src/utils";

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
			const { files, pinnedFilePaths } = get();
			return uniq(pinnedFilePaths)
				.map((path) => files.find((file) => file.path === path))
				.filter(Boolean) as TFile[];
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
			const { pinnedFilePaths } = get();
			return pinnedFilePaths.includes(file.path);
		},

		setPinnedFilePathsAndSave: async (filePaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			const paths = uniq(filePaths);
			await setValueAndSaveInPlugin({
				key: "pinnedFilePaths",
				value: paths,
				pluginKey: FFS_PINNED_FILE_PATHS_KEY,
				pluginValue: JSON.stringify(paths),
			});
		},

		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave } = get();
			const filePaths = [...pinnedFilePaths, file.path];
			await setPinnedFilePathsAndSave(filePaths);
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave } = get();
			const filePaths = removeItemFromArray(pinnedFilePaths, file.path);
			await setPinnedFilePathsAndSave(filePaths);
		},
		updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;
			const updatedPaths = replaceItemInArray(
				pinnedFilePaths,
				oldPath,
				newPath
			);
			await setPinnedFilePathsAndSave(updatedPaths);
		},

		restorePinnedFiles: async () => {
			const { restoreDataFromPlugin } = get();
			await restoreDataFromPlugin({
				pluginKey: FFS_PINNED_FILE_PATHS_KEY,
				key: "pinnedFilePaths",
				needParse: true,
			});
		},
	});
