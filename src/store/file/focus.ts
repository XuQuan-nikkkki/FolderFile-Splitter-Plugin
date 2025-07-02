import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOCUSED_FILE_PATH_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface FocusedFileSlice {
	focusedFile: TFile | null;

	isFocusedFile: (file: TFile) => boolean;

	setFocusedFileAndSave: (file: TFile | null) => void;
	restoreLastFocusedFile: () => void;
	clearFocusedFile: () => void;
}

export const createFocusedFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedFileSlice> =>
	(set, get) => ({
		focusedFile: null,

		isFocusedFile: (file: TFile) => {
			return file.path === get().focusedFile?.path;
		},

		setFocusedFileAndSave: (file: TFile | null) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "focusedFile",
				value: file,
				localStorageKey: FFS_FOCUSED_FILE_PATH_KEY,
				localStorageValue: file ? file.path : "",
			});
		},

		restoreLastFocusedFile: () => {
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

		clearFocusedFile: () => {
			get().setFocusedFileAndSave(null);
		},
	});
