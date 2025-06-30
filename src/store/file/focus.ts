import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOCUSED_FILE_PATH_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface FocusedFileSlice {
	focusedFile: TFile | null;

	setFocusedFileAndSave: (file: TFile | null) => void;
	restoreLastFocusedFile: () => Promise<void>;
	clearFocusedFile: () => Promise<void>;
}

export const createFocusedFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedFileSlice> =>
	(set, get) => ({
		focusedFile: null,

		setFocusedFileAndSave: (file: TFile | null) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "focusedFile",
				value: file,
				localStorageKey: FFS_FOCUSED_FILE_PATH_KEY,
				localStorageValue: file ? file.path : "",
			});
		},

		restoreLastFocusedFile: async () => {
			const {
				findFileByPath,
				selectFileAndOpen,
				getDataFromLocalStorage,
			} = get();
			const lastFocusedFilePath = getDataFromLocalStorage(
				FFS_FOCUSED_FILE_PATH_KEY
			);
			if (!lastFocusedFilePath) return;
			const file = findFileByPath(lastFocusedFilePath);
			if (file) {
				selectFileAndOpen(file);
			}
		},

		clearFocusedFile: async () => {
			await get().setFocusedFileAndSave(null);
		},
	});
