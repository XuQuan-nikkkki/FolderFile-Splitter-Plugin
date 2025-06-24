import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FILE_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, replaceItemInArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

export interface PinnedFileSlice {
	pinnedFilePaths: string[];

	getPinnedFiles: () => TFile[];

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

		isFilePinned: (file: TFile) => {
			const { pinnedFilePaths } = get();
			return pinnedFilePaths.includes(file.path);
		},

		setPinnedFilePathsAndSave: async (filePaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "pinnedFilePaths",
				value: filePaths,
				pluginKey: FFS_PINNED_FILE_PATHS_KEY,
				pluginValue: JSON.stringify(filePaths),
			});
		},

		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave } = get();
			const filePaths = uniq([...pinnedFilePaths, file.path]);
			await setPinnedFilePathsAndSave(filePaths);
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave } = get();
			const filePaths = uniq(
				removeItemFromArray(pinnedFilePaths, file.path)
			);
			await setPinnedFilePathsAndSave(filePaths);
		},
		updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, setPinnedFilePathsAndSave } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;
			const updatedPaths = uniq(
				replaceItemInArray(pinnedFilePaths, oldPath, newPath)
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
