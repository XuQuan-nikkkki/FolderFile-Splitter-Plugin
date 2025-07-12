import { StateCreator } from "zustand";

import { FFS_VIEW_MODE_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { ValueOf } from "src/settings";
import { ExplorerStore } from "src/store";

export const VIEW_MODE = {
	ALL: "all",
	TAG: "tag",
	FOLDER: "folder",
};
export type ViewMode = ValueOf<typeof VIEW_MODE>;
export const DEFAULT_VIEW_MODE: ViewMode = VIEW_MODE.FOLDER;

export type ViewModeSlice = {
	viewMode: ViewMode;
	changeViewMode: (mode: ViewMode) => void;
	restoreViewMode: () => void;

	changeToTagMode: () => void;
	changeToFolderMode: () => void;
	changeToAllMode: () => void;
};

export const createViewModeSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ViewModeSlice> =>
	(set, get) => ({
		viewMode: DEFAULT_VIEW_MODE,

		changeViewMode: (mode: ViewMode) => {
			get().setValueAndSaveInLocalStorage({
				key: "viewMode",
				value: mode,
				localStorageKey: FFS_VIEW_MODE_KEY,
				localStorageValue: mode,
			});
		},
		restoreViewMode: () => {
			get().restoreDataFromLocalStorage({
				localStorageKey: FFS_VIEW_MODE_KEY,
				key: "viewMode",
			});
		},

		changeToFolderMode: () => {
			get().changeViewMode(VIEW_MODE.FOLDER);
		},
		changeToTagMode: () => {
			get().changeViewMode(VIEW_MODE.TAG);
		},
		changeToAllMode: () => {
			get().changeViewMode(VIEW_MODE.ALL);
		},
	});
