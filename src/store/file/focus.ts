import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOCUSED_FILE_PATH_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface FocusedFileSlice {
	focusedFile: TFile | null;

	getFocusedFiles: () => TFile[];
	findFileByPath: (path: string) => TFile | null;
	setFocusedFile: (file: TFile | null) => Promise<void>;
	restoreLastFocusedFile: () => Promise<void>;
}

export const createFocusedFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedFileSlice> =>
	(set, get) => ({
		focusedFile: null,

		getFocusedFiles: () => {
			const {
				focusedFolder,
				focusedTag,
				getFilesInFolder,
				getFilesInTag,
				viewMode,
			} = get();
			if (viewMode === "all") {
				return plugin.app.vault.getFiles();
			}

			if (focusedFolder) {
				return getFilesInFolder(focusedFolder);
			}
			if (focusedTag) {
				return getFilesInTag(focusedTag);
			}
			return [];
		},
		findFileByPath: (path: string): TFile | null => {
			return plugin.app.vault.getFileByPath(path);
		},

		setFocusedFile: async (file: TFile | null) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "focusedFile",
				value: file,
				localStorageKey: FFS_FOCUSED_FILE_PATH_KEY,
				localStorageValue: file ? file.path : "",
			});
		},

		restoreLastFocusedFile: async () => {
			const { findFileByPath, selectFile, getDataFromLocalStorage } =
				get();
			const lastFocusedFilePath = getDataFromLocalStorage(
				FFS_FOCUSED_FILE_PATH_KEY
			);
			if (!lastFocusedFilePath) return;
			const file = findFileByPath(lastFocusedFilePath);
			if (file) {
				selectFile(file);
			}
		},
	});
