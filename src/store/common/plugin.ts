import { StateCreator } from "zustand";

import { ExplorerStore } from "src/store";
import { logError, uniq } from "src/utils";

import FolderFileSplitterPlugin from "../../main";

type SetValueAndSaveInPluginParams<T> = {
	key: string;
	value: T;
	pluginKey: string;
	pluginValue: T | string;
};
type RestoreDataFromPluginParams = {
	pluginKey: string;
	key: string;
	needParse?: boolean;
	transform?: (value: unknown) => unknown;
	validate?: (value: unknown) => boolean;
};

export type PluginSlice = {
	getDataFromPlugin: <T>(key: string) => Promise<T | undefined>;
	saveDataInPlugin: (oata: Record<string, unknown>) => Promise<void>;

	setValueAndSaveInPlugin: <T>({
		key,
		value,
		pluginKey,
		pluginValue,
	}: SetValueAndSaveInPluginParams<T>) => Promise<void>;
	restoreDataFromPlugin: ({
		pluginKey,
		key,
		needParse,
	}: RestoreDataFromPluginParams) => Promise<unknown>;
};

export const createPluginSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PluginSlice> =>
	(set, get, store) => ({
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

		setValueAndSaveInPlugin: async <T>({
			key,
			value,
			pluginKey,
			pluginValue,
		}: SetValueAndSaveInPluginParams<T>): Promise<void> => {
			const { saveDataInPlugin } = get();
			set({ [key]: value } as Partial<ExplorerStore>);
			await saveDataInPlugin({ [pluginKey]: pluginValue });
		},
		restoreDataFromPlugin: async ({
			pluginKey,
			key,
			needParse = false,
			transform,
			validate,
		}: RestoreDataFromPluginParams) => {
			const { getDataFromPlugin } = get();
			const raw = await getDataFromPlugin<string>(pluginKey);
			if (!raw) return;

			try {
				const parsed = needParse ? JSON.parse(raw) : raw;
				const removeDuplicate = Array.isArray(parsed)
					? uniq(parsed)
					: parsed;
				const final = transform
					? transform(removeDuplicate)
					: removeDuplicate;

				if (validate && !validate(final)) return;

				set({ [key]: final } as Partial<ExplorerStore>);
				return parsed;
			} catch (error) {
				logError({
					name: "restoreDataFromPlugin",
					error,
					data: raw,
					params: {
						key,
						pluginKey,
						needParse,
					},
				});
			}
		},
	});
