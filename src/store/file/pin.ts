import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FILE_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, replaceItemInArray } from "src/utils";

import { ExplorerStore } from "..";

export interface PinnedFileSlice {
	pinnedFilePaths: string[];

	isFilePinned: (file: TFile) => boolean;
	pinFile: (file: TFile) => Promise<void>;

	_updatePinnedFilePaths: (paths: string[]) => Promise<void>;
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

		isFilePinned: (file: TFile) => {
			const { pinnedFilePaths } = get();
			return pinnedFilePaths.includes(file.path);
		},
		_updatePinnedFilePaths: async (filePaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "pinnedFilePaths",
				value: filePaths,
				pluginKey: FFS_PINNED_FILE_PATHS_KEY,
				pluginValue: JSON.stringify(filePaths),
			});
		},
		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			const filePaths = [...pinnedFilePaths, file.path];
			await _updatePinnedFilePaths(filePaths);
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			const filePaths = removeItemFromArray(pinnedFilePaths, file.path);
			await _updatePinnedFilePaths(filePaths);
		},
		updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;
			const updatedPaths = replaceItemInArray(
				pinnedFilePaths,
				oldPath,
				newPath
			);
			await _updatePinnedFilePaths(updatedPaths);
		},
		restorePinnedFiles: async () => {
			const { getDataFromPlugin: getData } = get();
			const pinnedFilePaths = await getData<string>(
				FFS_PINNED_FILE_PATHS_KEY
			);
			if (pinnedFilePaths) {
				try {
					const filePaths: string[] = JSON.parse(pinnedFilePaths);
					set({
						pinnedFilePaths: filePaths,
					});
				} catch (error) {
					console.error("Invalid Json format: ", error);
				}
			}
		},
	});
