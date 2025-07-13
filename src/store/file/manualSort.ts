import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FILE_MANUAL_SORT_ORDER_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeDuplicateFromObjValues } from "src/utils";

import { ExplorerStore } from "..";
import { DEFAULT_MANUAL_SORT_ORDER, ManualSortOrder } from "../common";

export interface ManualSortFileSlice {
	filesManualSortOrder: ManualSortOrder;

	getInitialFilesOrder: () => ManualSortOrder;
	getRestoredFilesOrder: () => Promise<ManualSortOrder>;

	setFilesManualOrderAndSave: (
		updatedOrder: ManualSortOrder
	) => Promise<void>;

	initFilesManualSortOrder: () => Promise<void>;
	restoreFilesManualSortOrder: () => Promise<void>;
	updateFilePathInManualOrder: (
		parentPath: string,
		oldPath: string,
		newPath: string
	) => Promise<void>;
	moveFileInManualOrder: (file: TFile, atIndex: number) => Promise<void>;
	clearFileManualOrderAndSave: () => Promise<void>;
}

export const createManualSortFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ManualSortFileSlice> =>
	(set, get) => ({
		filesManualSortOrder: {},

		getInitialFilesOrder: () => {
			const {
				sortFiles,
				getFilesInFolder,
				foldersWithRoot: foldersToInit,
				getInitialOrder,
			} = get();
			const order: ManualSortOrder = getInitialOrder(
				foldersToInit,
				getFilesInFolder,
				sortFiles
			);

			return order;
		},
		getRestoredFilesOrder: async () => {
			const { getRestoredOrder } = get();
			return await getRestoredOrder(FFS_FILE_MANUAL_SORT_ORDER_KEY);
		},

		setFilesManualOrderAndSave: async (updatedOrder: ManualSortOrder) => {
			const { setValueAndSaveInPlugin } = get();
			const order = removeDuplicateFromObjValues(updatedOrder);
			await setValueAndSaveInPlugin({
				key: "filesManualSortOrder",
				value: order,
				pluginKey: FFS_FILE_MANUAL_SORT_ORDER_KEY,
				pluginValue: order,
			});
		},

		initFilesManualSortOrder: async () => {
			const { getInitialFilesOrder, setFilesManualOrderAndSave } = get();
			const order: ManualSortOrder = getInitialFilesOrder();
			await setFilesManualOrderAndSave(order);
		},
		restoreFilesManualSortOrder: async () => {
			const {
				getRestoredFilesOrder,
				getInitialFilesOrder,
				resolveValidManualSortOrder,
				isFilePathValid,
				setFilesManualOrderAndSave,
			} = get();
			const restoredOrder = await getRestoredFilesOrder();
			const initialOrder = getInitialFilesOrder();
			const finalOrder = resolveValidManualSortOrder(
				restoredOrder,
				initialOrder,
				isFilePathValid
			);

			await setFilesManualOrderAndSave(finalOrder);
		},

		moveFileInManualOrder: async (file: TFile, atIndex: number) => {
			const {
				filesManualSortOrder,
				setFilesManualOrderAndSave,
				moveItemInManualOrder,
			} = get();
			await moveItemInManualOrder(
				filesManualSortOrder,
				file,
				atIndex,
				setFilesManualOrderAndSave
			);
		},

		updateFilePathInManualOrder: async (
			parentPath: string,
			oldPath: string,
			newPath: string
		) => {
			const {
				filesManualSortOrder: order,
				setFilesManualOrderAndSave,
				updatePathInManualOrder,
			} = get();
			await updatePathInManualOrder(order, setFilesManualOrderAndSave, {
				parentPath,
				oldPath,
				newPath,
			});
		},

		clearFileManualOrderAndSave: async () => {
			await get().setFilesManualOrderAndSave(DEFAULT_MANUAL_SORT_ORDER);
		},
	});
