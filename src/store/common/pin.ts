import { TAbstractFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";
import { replaceItemInArray, uniq } from "src/utils";

import { TagNode } from "../tag";

export type PinnedItem = TAbstractFile | TagNode;

export type PinSlice = {
	getPinnedItems: <T extends PinnedItem>(
		paths: string[],
		getter: (path: string) => T | undefined
	) => T[];

	isPinned: (pinnedPaths: string[], path: string) => boolean;
	setPinnedPathsAndSave: (
		key: string,
		pluginKey: string,
		paths: string[]
	) => Promise<void>;
	pinItem: (
		path: string,
		paths: string[],
		save: (paths: string[]) => Promise<void>
	) => Promise<void>;
	unpinItem: (
		path: string,
		paths: string[],
		save: (paths: string[]) => Promise<void>
	) => Promise<void>;
	updatePinnedPath: (
		oldPath: string,
		newPath: string,
		pinnedPaths: string[],
		save: (paths: string[]) => Promise<void>
	) => Promise<void>;
	restorePinnedPaths: (key: string, pluginKey: string) => Promise<void>;
};

export const createPinSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinSlice> =>
	(set, get) => ({
		getPinnedItems: <T extends PinnedItem>(
			paths: string[],
			getter: (path: string) => T | undefined
		): T[] => {
			return uniq(paths).map(getter).filter(Boolean) as T[];
		},

		isPinned: (pinnedPaths: string[], path: string): boolean => {
			return pinnedPaths.includes(path);
		},

		setPinnedPathsAndSave: async (
			key: string,
			pluginKey: string,
			paths: string[]
		) => {
			const { setValueAndSaveInPlugin } = get();
			const uniquePaths = uniq(paths);
			await setValueAndSaveInPlugin({
				key,
				value: uniquePaths,
				pluginKey,
				pluginValue: JSON.stringify(uniquePaths),
			});
		},

		pinItem: async (
			path: string,
			paths: string[],
			save: (paths: string[]) => Promise<void>
		) => {
			const { isPinned } = get();
			if (isPinned(paths, path)) return;
			const newPaths = [...paths, path];
			await save(newPaths);
		},
		unpinItem: async (
			path: string,
			paths: string[],
			save: (paths: string[]) => Promise<void>
		) => {
			const { isPinned } = get();
			if (!isPinned(paths, path)) return;
			const newPaths = paths.filter((p) => p !== path);
			await save(newPaths);
		},

		updatePinnedPath: async (
			oldPath: string,
			newPath: string,
			pinnedPaths: string[],
			save: (paths: string[]) => Promise<void>
		) => {
			const { isPinned } = get();
			if (!isPinned(pinnedPaths, oldPath)) return;
			const updatedPaths = replaceItemInArray(
				pinnedPaths,
				oldPath,
				newPath
			);
			await save(updatedPaths);
		},

		restorePinnedPaths: async (key: string, pluginKey: string) => {
			const { restoreDataFromPlugin } = get();
			await restoreDataFromPlugin({
				pluginKey,
				key,
				needParse: true,
			});
		},
	});
