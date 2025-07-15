import { StateCreator } from "zustand";

import { FFS_VIEW_MODE_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { ValueOf } from "src/settings";
import { ExplorerStore } from "src/store";

export const VIEW_MODE = {
	ALL: "all",
	TAG: "tag",
	FOLDER: "folder",
	SEARCH: "search",
} as const;
export type ViewMode = ValueOf<typeof VIEW_MODE>;
export const DEFAULT_VIEW_MODE: ViewMode = VIEW_MODE.FOLDER;

export type ViewModeSlice = {
	viewMode: ViewMode;

	canFilesManualSortViewModes: ViewMode[];
	canFilesSortViewModes: ViewMode[];
	canCreateFilesViewModes: ViewMode[];

	changeViewMode: (mode: ViewMode) => void;
	restoreViewMode: () => void;

	changeToTagMode: () => void;
	changeToFolderMode: () => void;
	changeToAllMode: () => void;
	changeToSearchMode: () => void;
};

export const createViewModeSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ViewModeSlice> =>
	(set, get) => ({
		viewMode: DEFAULT_VIEW_MODE,

		get canFilesManualSortViewModes(): ViewMode[] {
			return [VIEW_MODE.FOLDER];
		},

		get canFilesSortViewModes(): ViewMode[] {
			return [VIEW_MODE.FOLDER, VIEW_MODE.TAG, VIEW_MODE.ALL];
		},

		get canCreateFilesViewModes(): ViewMode[] {
			return [VIEW_MODE.FOLDER];
		},

		changeViewMode: (mode: ViewMode) => {
			get().setValueAndSaveInLocalStorage({
				key: "viewMode",
				value: mode,
				localStorageKey: FFS_VIEW_MODE_KEY,
				localStorageValue: mode,
			});
		},
		restoreViewMode: () => {
			const { restoreDataFromLocalStorage, focusedFolder, focusedTag } =
				get();
			restoreDataFromLocalStorage({
				localStorageKey: FFS_VIEW_MODE_KEY,
				key: "viewMode",
				transform: (mode: ViewMode) => {
					const { FOLDER, TAG } = VIEW_MODE;
					if (![FOLDER, TAG].includes(mode as typeof FOLDER | typeof TAG)) {
						if (focusedFolder) {
							return FOLDER;
						}
						if (focusedTag) {
							return TAG;
						}
						return FOLDER;
					}
					return mode
				},
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
		changeToSearchMode: () => {
			get().changeViewMode(VIEW_MODE.SEARCH);
		},
	});
