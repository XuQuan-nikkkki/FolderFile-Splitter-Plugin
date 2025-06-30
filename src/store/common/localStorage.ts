import { StateCreator } from "zustand";

import { ExplorerStore } from "src/store";
import { logError, uniq } from "src/utils";

import FolderFileSplitterPlugin from "../../main";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;
export const DEFAULT_MANUAL_SORT_ORDER: ManualSortOrder = {};

type SetValueAndSaveInLocalStorageParams<T> = {
	key: string;
	value: T;
	localStorageKey: string;
	localStorageValue: string;
};

type RestoreDataFromLocalStorageParams = {
	localStorageKey: string;
	key: string;
	needParse?: boolean;
	transform?: (value: unknown) => unknown;
	validate?: (value: unknown) => boolean;
};
export type LocalStorageSlice = {
	getDataFromLocalStorage: (key: string) => string | null;
	saveDataInLocalStorage: (key: string, value: string) => void;
	removeDataFromLocalStorage: (key: string) => void;

	setValueAndSaveInLocalStorage: <T>({
		key,
		value,
		localStorageKey,
		localStorageValue,
	}: SetValueAndSaveInLocalStorageParams<T>) => void;
	restoreDataFromLocalStorage: <T>({
		localStorageKey,
		key,
		needParse,
		transform,
	}: RestoreDataFromLocalStorageParams) => T;
};

export const createLocalStorageSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], LocalStorageSlice> =>
	(set, get) => ({
		saveDataInLocalStorage: (key: string, value: string) => {
			localStorage.setItem(key, value);
		},
		getDataFromLocalStorage: (key: string) => {
			return localStorage.getItem(key);
		},
		removeDataFromLocalStorage: (key: string) => {
			localStorage.removeItem(key);
		},

		setValueAndSaveInLocalStorage: <T>({
			key,
			value,
			localStorageKey,
			localStorageValue,
		}: SetValueAndSaveInLocalStorageParams<T>) => {
			const { saveDataInLocalStorage, removeDataFromLocalStorage } =
				get();

			set({ [key]: value } as Partial<ExplorerStore>);

			if (value === null || value === undefined) {
				removeDataFromLocalStorage(localStorageKey);
			} else {
				saveDataInLocalStorage(localStorageKey, localStorageValue);
			}
		},
		restoreDataFromLocalStorage: ({
			localStorageKey,
			key,
			needParse = false,
			transform,
			validate,
		}: RestoreDataFromLocalStorageParams) => {
			const { getDataFromLocalStorage } = get();
			const raw = getDataFromLocalStorage(localStorageKey);
			if (!raw) return;

			try {
				const parsed = needParse ? JSON.parse(raw) : raw;
				const removeDuplicate = Array.isArray(parsed)
					? uniq(parsed)
					: parsed;
				const finalData = transform
					? transform(removeDuplicate)
					: removeDuplicate;

				if (validate && !validate(finalData)) return;

				set({ [key]: finalData } as Partial<ExplorerStore>);
				return finalData;
			} catch (error) {
				logError({
					name: "restoreDataFromLocalStorage",
					error,
					data: raw,
					params: {
						key,
						localStorageKey,
						needParse,
						hasTransform: !!transform,
					},
				});
			}
		},
	});
