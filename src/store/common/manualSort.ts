import { TAbstractFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { ExplorerStore } from "src/store";
import { appendMissingItems, areArraysEqual, moveItemInArray } from "src/utils";

import FolderFileSplitterPlugin from "../../main";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;
export const DEFAULT_MANUAL_SORT_ORDER: ManualSortOrder = {};

type UpdateOrderFn = (updatedOrder: ManualSortOrder) => Promise<void>;
type UpdatePathInManualOrderPathParams = {
	parentPath: string;
	oldPath: string;
	newPath: string;
};

export type ManualSortSlice = {
	getInitialOrder: (
		folders: TFolder[],
		getItems: (folder: TFolder) => TAbstractFile[],
		sortItems: (items: TAbstractFile[]) => TAbstractFile[]
	) => ManualSortOrder;
	getRestoredOrder: (pluginKey: string) => Promise<ManualSortOrder>;
	resolveValidManualSortOrder: (
		restoredOrder: ManualSortOrder,
		initialOrder: ManualSortOrder,
		isPathValid: (path: string) => boolean
	) => ManualSortOrder;
	getUpdatedPaths: (
		paths: string[],
		pathToUpdate: string,
		toIndex: number
	) => string[];
	moveItemInManualOrder: (
		order: ManualSortOrder,
		item: TAbstractFile,
		atIndex: number,
		updatedOrder: UpdateOrderFn
	) => Promise<void>;
	updatePathInManualOrder: (
		order: ManualSortOrder,
		updateOrder: UpdateOrderFn,
		params: UpdatePathInManualOrderPathParams
	) => Promise<void>;
};

export const createManualSortSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ManualSortSlice> =>
	(set, get) => ({
		getInitialOrder: (
			folders: TFolder[],
			getItems: (folder: TFolder) => TAbstractFile[],
			sortItems: (items: TAbstractFile[]) => TAbstractFile[]
		) => {
			const order: ManualSortOrder = DEFAULT_MANUAL_SORT_ORDER;

			folders.forEach((folder) => {
				const items = getItems(folder);
				if (!items.length) return;

				const sortedItems = sortItems(items);
				order[folder.path] = sortedItems.map((i) => i.path);
			});
			return order;
		},
		getRestoredOrder: async (pluginKey: string) => {
			const { getDataFromPlugin } = get();
			return (
				(await getDataFromPlugin<ManualSortOrder>(pluginKey)) ??
				DEFAULT_MANUAL_SORT_ORDER
			);
		},

		resolveValidManualSortOrder: (
			restoredOrder: ManualSortOrder,
			initialOrder: ManualSortOrder,
			isPathValid: (path: string) => boolean
		): ManualSortOrder => {
			const finalOrder = DEFAULT_MANUAL_SORT_ORDER;

			const folderPaths = Object.keys(initialOrder);
			if (!folderPaths.length) {
				return finalOrder;
			}
			if (!Object.keys(restoredOrder).length) {
				return initialOrder;
			}
			for (const folderPath of folderPaths) {
				const restoredPaths = restoredOrder[folderPath] ?? [];
				const currentPaths = initialOrder[folderPath] ?? [];

				if (!restoredPaths.length || !currentPaths.length) {
					finalOrder[folderPath] = currentPaths;
					continue;
				}

				const validRestoredPaths = restoredPaths.filter(isPathValid);

				finalOrder[folderPath] = appendMissingItems(
					validRestoredPaths,
					currentPaths
				);
			}
			return finalOrder;
		},

		getUpdatedPaths: (
			paths: string[],
			pathToUpdate: string,
			toIndex: number
		): string[] => {
			const currentIndex = paths.indexOf(pathToUpdate);
			if (currentIndex === -1 || currentIndex === toIndex) return paths;
			return moveItemInArray(paths, currentIndex, toIndex);
		},

		moveItemInManualOrder: async (
			order: ManualSortOrder,
			item: TAbstractFile,
			atIndex: number,
			updatedOrderAndSave: (
				updatedOrder: ManualSortOrder
			) => Promise<void>
		) => {
			const { getUpdatedPaths } = get();

			const parentPath = item.parent?.path;
			if (!parentPath) return;

			const currentPaths = order[parentPath] ?? [];
			if (!currentPaths.length) return;

			const updatedPaths = getUpdatedPaths(
				currentPaths,
				item.path,
				atIndex
			);

			if (areArraysEqual(updatedPaths, currentPaths)) return;

			const updatedOrder = {
				...order,
				[parentPath]: updatedPaths,
			};

			await updatedOrderAndSave(updatedOrder);
		},

		updatePathInManualOrder: async (
			order: ManualSortOrder,
			saveOrder: (updatedOrder: ManualSortOrder) => Promise<void>,
			{ parentPath, oldPath, newPath }: UpdatePathInManualOrderPathParams
		) => {
			const updatedOrder = { ...order };

			const orderedPaths = updatedOrder[parentPath] ?? [];
			if (!orderedPaths.length) {
				updatedOrder[parentPath] = [newPath];
				await saveOrder(updatedOrder);
				return;
			}

			const index = orderedPaths.indexOf(oldPath);
			if (index >= 0) {
				orderedPaths[index] = newPath;
			} else {
				orderedPaths.push(newPath);
			}
			await saveOrder(updatedOrder);
		},
	});
