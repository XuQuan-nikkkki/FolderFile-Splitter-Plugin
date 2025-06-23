import { StateCreator } from "zustand";

import { FFS_VIEW_MODE_KEY } from "src/assets/constants";
import { ValueOf } from "src/settings";
import { ExplorerStore } from "src/store";

import FolderFileSplitterPlugin from "../main";

export const VIEW_MODE = {
	ALL: "all",
	TAG: "tag",
	FOLDER: "folder",
};
export type ViewMode = ValueOf<typeof VIEW_MODE>;
export const DEFAULT_VIEW_MODE: ViewMode = VIEW_MODE.FOLDER;

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;

export type CommonExplorerStore = {
	viewMode: ViewMode;
	changeViewMode: (mode: ViewMode) => void;
	restoreViewMode: () => void;

	getDataFromLocalStorage: (key: string) => string | null;
	saveDataInLocalStorage: (key: string, value: string) => void;
	removeDataFromLocalStorage: (key: string) => void;
	getDataFromPlugin: <T>(key: string) => Promise<T | undefined>;
	saveDataInPlugin: (data: Record<string, unknown>) => Promise<void>;
};

export const createCommonExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], CommonExplorerStore> =>
	(set, get) => ({
		viewMode: DEFAULT_VIEW_MODE,

		changeViewMode: (mode: ViewMode) => {
			const { saveDataInLocalStorage } = get();
			set({
				viewMode: mode,
			});
			saveDataInLocalStorage(FFS_VIEW_MODE_KEY, mode);
		},
		restoreViewMode: () => {
			const { getDataFromLocalStorage } = get();
			const viewMode = getDataFromLocalStorage(FFS_VIEW_MODE_KEY);
			if (!viewMode) return;
			set({
				viewMode,
			});
		},

		saveDataInLocalStorage: (key: string, value: string) => {
			localStorage.setItem(key, value);
		},
		getDataFromLocalStorage: (key: string) => {
			return localStorage.getItem(key);
		},
		removeDataFromLocalStorage: (key: string) => {
			localStorage.removeItem(key);
		},
		saveDataInPlugin: async (
			data: Record<string, unknown>
		): Promise<void> => {
			const previousData = await plugin.loadData();
			await plugin.saveData({
				...previousData,
				...data,
			});
		},
		getDataFromPlugin: async <T>(key: string): Promise<T | undefined> => {
			try {
				const data = await plugin.loadData();
				return data[key];
			} catch (e) {
				console.error(e);
				return undefined;
			}
		},
	});
