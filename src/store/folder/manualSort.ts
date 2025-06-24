import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOLDER_MANUAL_SORT_ORDER_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";
import { ManualSortOrder } from "../common";

export interface ManualSortFolderSlice {
	foldersManualSortOrder: ManualSortOrder;

	initFoldersManualSortOrder: () => Promise<void>;
	getInitialFoldersOrder: () => ManualSortOrder;
	restoreFoldersManualSortOrder: () => Promise<void>;
	changeFoldersManualOrder: (
		folder: TFolder,
		atIndex: number
	) => ManualSortOrder | undefined;
	changeFoldersManualOrderAndSave: (
		folder: TFolder,
		atIndex: number
	) => Promise<void>;
	_updateAndSaveFoldersOrder: (
		updatedOrder: ManualSortOrder
	) => Promise<void>;
	_updateFolderManualOrder: (
		parentPath: string,
		oldPath: string,
		newPath: string
	) => Promise<void>;
}

export const createManualSortFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ManualSortFolderSlice> =>
	(set, get) => ({
		foldersManualSortOrder: {},

		getInitialFoldersOrder: () => {
			const { folderSortRule, getSubFolders, sortFolders } = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				if (folder) {
					const folders = getSubFolders(folder);
					if (folders.length) {
						const sortedFolders = sortFolders(
							folders,
							folderSortRule,
							plugin.settings.includeSubfolderFiles
						);
						order[folder.path] = sortedFolders.map(
							(folder) => folder.path
						);
					}
				}
			});
			return order;
		},

		initFoldersManualSortOrder: async () => {
			const {
				folderSortRule,
				getSubFolders,
				sortFolders,
				saveDataInPlugin,
			} = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				const folders = getSubFolders(folder);
				if (folders.length) {
					const sortedFolders = sortFolders(
						folders,
						folderSortRule,
						plugin.settings.includeSubfolderFiles
					);
					order[folder.path] = sortedFolders.map(
						(folder) => folder.path
					);
				}
			});
			set({
				foldersManualSortOrder: order,
			});
			await saveDataInPlugin({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: order,
			});
		},
		restoreFoldersManualSortOrder: async () => {
			const {
				getDataFromPlugin,
				getInitialFoldersOrder,
				_updateAndSaveFoldersOrder,
			} = get();
			const { vault } = plugin.app;
			const order = getInitialFoldersOrder();
			const previousOrder =
				(await getDataFromPlugin<ManualSortOrder>(
					FFS_FOLDER_MANUAL_SORT_ORDER_KEY
				)) ?? {};
			Object.keys(previousOrder).forEach((parentFolderPath) => {
				if (!vault.getFolderByPath(parentFolderPath)) return;
				const paths = previousOrder[parentFolderPath].filter((p) =>
					Boolean(vault.getFolderByPath(p))
				);
				if (paths.length > 0) {
					order[parentFolderPath] = paths;
				}
			});
			await _updateAndSaveFoldersOrder(order);
		},
		changeFoldersManualOrder: (folder: TFolder, atIndex: number) => {
			const { foldersManualSortOrder } = get();
			const parentPath = folder.parent?.path;
			if (!parentPath) return;

			const initialOrder = foldersManualSortOrder[parentPath] ?? [];
			const currentIndex = initialOrder.indexOf(folder.path);
			if (currentIndex === atIndex) {
				return foldersManualSortOrder;
			}
			const newOrder = [...initialOrder];
			newOrder.splice(currentIndex, 1);
			newOrder.splice(atIndex, 0, folder.path);
			const updatedOrder = {
				...foldersManualSortOrder,
				[parentPath]: newOrder,
			};
			set({
				foldersManualSortOrder: updatedOrder,
			});
			return updatedOrder;
		},
		changeFoldersManualOrderAndSave: async (
			folder: TFolder,
			atIndex: number
		) => {
			const { saveDataInPlugin, changeFoldersManualOrder } = get();
			const updatedOrder = changeFoldersManualOrder(folder, atIndex);
			await saveDataInPlugin({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateAndSaveFoldersOrder: async (updatedOrder: ManualSortOrder) => {
			const { saveDataInPlugin } = get();
			set({
				foldersManualSortOrder: updatedOrder,
			});

			await saveDataInPlugin({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateFolderManualOrder: async (
			parentPath: string,
			oldPath: string,
			newPath: string
		) => {
			const {
				foldersManualSortOrder: order,
				_updateAndSaveFoldersOrder,
			} = get();
			const orderedPaths = [...(order[parentPath] ?? [])];
			if (!orderedPaths.length) return;
			const updatedOrder = { ...order };
			const index = orderedPaths.indexOf(oldPath);
			if (index >= 0) {
				orderedPaths[index] = newPath;
			} else {
				orderedPaths.push(newPath);
			}
			updatedOrder[parentPath] = orderedPaths;
			const childPaths = updatedOrder[oldPath];
			if (childPaths) {
				delete updatedOrder[oldPath];
				updatedOrder[newPath] = childPaths;
			}
			_updateAndSaveFoldersOrder(updatedOrder);
		},
	});
