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
	saveDataInPlugin: (oata: Record<string, unknown>) => Promise<void>;

	setValueAndSaveInLocalStorage: <T>({
		key,
		value,
		localStorageKey,
		localStorageValue,
	}: {
		key: string;
		value: T;
		localStorageKey: string;
		localStorageValue: string | T;
	}) => void;
	setValueAndSaveInPlugin: <T>({
		key,
		value,
	}: {
		key: string;
		value: T;
		pluginKey: string;
		pluginValue: T | string;
	}) => Promise<void>;
};

export const createCommonExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], CommonExplorerStore> =>
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

		setValueAndSaveInLocalStorage: <T>({
			key,
			value,
			localStorageKey,
			localStorageValue,
		}: {
			key: string;
			value: T;
			localStorageKey: string;
			localStorageValue: string;
		}) => {
			const { saveDataInLocalStorage, removeDataFromLocalStorage } =
				get();

			set({ [key]: value } as Partial<ExplorerStore>);

			if (value === null || value === undefined) {
				removeDataFromLocalStorage(localStorageKey);
			} else {
				saveDataInLocalStorage(localStorageKey, localStorageValue);
			}
		},
		setValueAndSaveInPlugin: async <T>({
			key,
			value,
			pluginKey,
			pluginValue,
		}: {
			key: string;
			value: T;
			pluginKey: string;
			pluginValue: T | string;
		}): Promise<void> => {
			const { saveDataInPlugin } = get();
			set({ [key]: value } as Partial<ExplorerStore>);
			await saveDataInPlugin({ [pluginKey]: pluginValue });
		},
	});
