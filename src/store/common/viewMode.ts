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
};

export const createViewModeSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ViewModeSlice> =>
	(set, get) => ({
		viewMode: DEFAULT_VIEW_MODE,

		changeViewMode: (mode: ViewMode) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "viewMode",
				value: mode,
				localStorageKey: FFS_VIEW_MODE_KEY,
				localStorageValue: mode,
			});
		},
		restoreViewMode: () => {
			const { getDataFromLocalStorage } = get();
			const viewMode = getDataFromLocalStorage(FFS_VIEW_MODE_KEY);
			if (!viewMode) return;
			set({
				viewMode,
			});
		},

		changeToFolderMode: () => {
			const { changeViewMode, changeFocusedTag } = get();
			changeViewMode(VIEW_MODE.FOLDER);
			changeFocusedTag(null);
		},
		changeToTagMode: () => {
			const { changeViewMode, setFocusedFileAndSave } = get();
			changeViewMode(VIEW_MODE.TAG);
			setFocusedFileAndSave(null);
		},
	});
