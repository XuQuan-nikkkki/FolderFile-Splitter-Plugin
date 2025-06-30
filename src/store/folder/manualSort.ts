import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOLDER_MANUAL_SORT_ORDER_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";
import { DEFAULT_MANUAL_SORT_ORDER, ManualSortOrder } from "../common";

export interface ManualSortFolderSlice {
	foldersManualSortOrder: ManualSortOrder;

	getInitialFoldersOrder: () => ManualSortOrder;
	getRestoredFoldersOrder: () => Promise<ManualSortOrder>;

	initFoldersManualSortOrder: () => Promise<void>;
	restoreFoldersManualSortOrder: () => Promise<void>;
	moveFolderInManualOrder: (
		folder: TFolder,
		atIndex: number
	) => Promise<void>;
	setFoldersManualOrderAndSave: (
		updatedOrder: ManualSortOrder
	) => Promise<void>;
	updateFolderPathInManualOrder: (
		parentPath: string,
		oldPath: string,
		newPath: string
	) => Promise<void>;
	clearFoldersManualOrderAndSave: () => Promise<void>;
}

export const createManualSortFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ManualSortFolderSlice> =>
	(set, get) => ({
		foldersManualSortOrder: {},

		getInitialFoldersOrder: () => {
			const {
				getSubFolders,
				sortFolders,
				foldersWithRoot: foldersToInit,
				getInitialOrder,
			} = get();
			const order: ManualSortOrder = getInitialOrder(
				foldersToInit,
				getSubFolders,
				sortFolders
			);

			return order;
		},
		getRestoredFoldersOrder: async () => {
			const { getRestoredOrder } = get();
			return await getRestoredOrder(FFS_FOLDER_MANUAL_SORT_ORDER_KEY);
		},

		setFoldersManualOrderAndSave: async (updatedOrder: ManualSortOrder) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "foldersManualSortOrder",
				value: updatedOrder,
				pluginKey: FFS_FOLDER_MANUAL_SORT_ORDER_KEY,
				pluginValue: updatedOrder,
			});
		},

		initFoldersManualSortOrder: async () => {
			const { getInitialFoldersOrder, setFoldersManualOrderAndSave } =
				get();
			const order: ManualSortOrder = getInitialFoldersOrder();
			await setFoldersManualOrderAndSave(order);
		},
		restoreFoldersManualSortOrder: async () => {
			const {
				getRestoredFoldersOrder,
				getInitialFoldersOrder,
				resolveValidManualSortOrder,
				isFolderPathValid,
				setFoldersManualOrderAndSave,
			} = get();
			const restoredOrder = await getRestoredFoldersOrder();
			const initialOrder = getInitialFoldersOrder();
			const finalOrder: ManualSortOrder = resolveValidManualSortOrder(
				restoredOrder,
				initialOrder,
				isFolderPathValid
			);

			await setFoldersManualOrderAndSave(finalOrder);
		},
		moveFolderInManualOrder: async (folder: TFolder, atIndex: number) => {
			const {
				foldersManualSortOrder,
				setFoldersManualOrderAndSave,
				moveItemInManualOrder,
			} = get();
			await moveItemInManualOrder(
				foldersManualSortOrder,
				folder,
				atIndex,
				setFoldersManualOrderAndSave
			);
		},
		updateFolderPathInManualOrder: async (
			parentPath: string,
			oldPath: string,
			newPath: string
		) => {
			const {
				foldersManualSortOrder: order,
				setFoldersManualOrderAndSave,
				updatePathInManualOrder,
			} = get();
			await updatePathInManualOrder(order, setFoldersManualOrderAndSave, {
				parentPath,
				oldPath,
				newPath,
			});
		},

		clearFoldersManualOrderAndSave: async () => {
			await get().setFoldersManualOrderAndSave(DEFAULT_MANUAL_SORT_ORDER);
		},
	});
