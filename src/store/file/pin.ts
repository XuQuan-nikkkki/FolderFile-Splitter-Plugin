import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_PINNED_FILE_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface PinnedFileSlice {
	pinnedFilePaths: string[];

	isFilePinned: (file: TFile) => boolean;
	pinFile: (file: TFile) => Promise<void>;
	unpinFile: (file: TFile) => Promise<void>;
	restorePinnedFiles: () => Promise<void>;
	updateFilePinState: (oldPath: string, newPath: string) => Promise<void>;
	_updatePinnedFilePath: (oldPath: string, newPath: string) => Promise<void>;
	_updatePinnedFilePaths: (paths: string[]) => Promise<void>;
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
			const { saveDataInPlugin } = get();
			set({
				pinnedFilePaths: filePaths,
			});
			await saveDataInPlugin({
				[FFS_PINNED_FILE_PATHS_KEY]: JSON.stringify(filePaths),
			});
		},
		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			const filePaths = [...pinnedFilePaths, file.path];
			await _updatePinnedFilePaths(filePaths);
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			const filePaths = pinnedFilePaths.filter(
				(path) => path !== file.path
			);
			await _updatePinnedFilePaths(filePaths);
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
		updateFilePinState: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, _updatePinnedFilePath } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;
			await _updatePinnedFilePath(oldPath, newPath);
		},
		_updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;

			const pinnedIndex = pinnedFilePaths.indexOf(oldPath);
			const paths = [...pinnedFilePaths];
			paths.splice(pinnedIndex, 1, newPath);
			await _updatePinnedFilePaths(paths);
		},
	});
