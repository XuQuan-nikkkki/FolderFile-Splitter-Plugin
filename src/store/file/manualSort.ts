import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FILE_MANUAL_SORT_ORDER_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";
import { ManualSortOrder } from "../common";

import { FILE_MANUAL_SORT_RULE } from "./sort";

export interface ManualSortFileSlice {
	filesManualSortOrder: ManualSortOrder;

	initFilesManualSortOrder: () => Promise<void>;
	getInitialFilesOrder: () => ManualSortOrder;
	restoreFilesManualSortOrder: () => Promise<void>;
	updateFileManualOrder: (
		parentPath: string,
		oldPath: string,
		newPath: string
	) => Promise<void>;
	changeFilesManualOrder: (
		file: TFile,
		atIndex: number
	) => ManualSortOrder | undefined;
	changeFilesManualOrderAndSave: (
		file: TFile,
		atIndex: number
	) => Promise<void>;
	_updateAndSaveFilesOrder: (updatedOrder: ManualSortOrder) => Promise<void>;
}

export const createManualSortFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ManualSortFileSlice> =>
	(set, get) => ({
		filesManualSortOrder: {},

		getInitialFilesOrder: () => {
			const { fileSortRule, sortFiles, getFilesInFolder } = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				if (folder) {
					const files = getFilesInFolder(folder);
					if (files.length) {
						const sortedFiles = sortFiles(files, fileSortRule);
						order[folder.path] = sortedFiles.map(
							(file) => file.path
						);
					}
				}
			});
			return order;
		},
		initFilesManualSortOrder: async () => {
			const {
				fileSortRule,
				sortFiles,
				getFilesInFolder,
				setValueAndSaveInPlugin,
			} = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				const files = getFilesInFolder(folder);
				if (files.length) {
					const sortedFiles = sortFiles(files, fileSortRule);
					order[folder.path] = sortedFiles.map((file) => file.path);
				}
			});
			await setValueAndSaveInPlugin({
				key: "filesManualSortOrder",
				value: order,
				pluginKey: FFS_FILE_MANUAL_SORT_ORDER_KEY,
				pluginValue: order,
			});
		},
		restoreFilesManualSortOrder: async () => {
			const {
				getDataFromPlugin,
				getInitialFilesOrder,
				_updateAndSaveFilesOrder,
			} = get();
			const { vault } = plugin.app;
			const order = getInitialFilesOrder();
			const previousOrder =
				(await getDataFromPlugin<ManualSortOrder>(
					FFS_FILE_MANUAL_SORT_ORDER_KEY
				)) ?? {};
			Object.keys(previousOrder).forEach((path) => {
				if (!vault.getFolderByPath(path)) return;
				const paths = previousOrder[path].filter((path) =>
					Boolean(vault.getFileByPath(path))
				);
				if (paths.length > 0) {
					order[path] = paths;
				}
			});
			await _updateAndSaveFilesOrder(order);
		},
		changeFilesManualOrder: (file: TFile, atIndex: number) => {
			const { filesManualSortOrder } = get();
			const parentPath = file.parent?.path;
			if (!parentPath) return;

			const initialOrder = filesManualSortOrder[parentPath] ?? [];
			const currentIndex = initialOrder.indexOf(file.path);
			if (currentIndex === atIndex) {
				return filesManualSortOrder;
			}
			const newOrder = [...initialOrder];
			newOrder.splice(currentIndex, 1);
			newOrder.splice(atIndex, 0, file.path);
			const updatedOrder = {
				...filesManualSortOrder,
				[parentPath]: newOrder,
			};
			set({
				filesManualSortOrder: updatedOrder,
				fileSortRule: FILE_MANUAL_SORT_RULE,
			});
			return updatedOrder;
		},
		changeFilesManualOrderAndSave: async (file: TFile, atIndex: number) => {
			const { saveDataInPlugin, changeFilesManualOrder } = get();
			const updatedOrder = changeFilesManualOrder(file, atIndex);
			await saveDataInPlugin({
				[FFS_FILE_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateAndSaveFilesOrder: async (updatedOrder: ManualSortOrder) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "filesManualSortOrder",
				value: updatedOrder,
				pluginKey: FFS_FILE_MANUAL_SORT_ORDER_KEY,
				pluginValue: updatedOrder,
			});
		},
		updateFileManualOrder: async (
			parentPath: string,
			oldPath: string,
			newPath: string
		) => {
			const { filesManualSortOrder: order, _updateAndSaveFilesOrder } =
				get();
			const orderedPaths = [...(order[parentPath] ?? [])];
			if (!orderedPaths.length) return;
			const index = orderedPaths.indexOf(oldPath);
			if (index >= 0) {
				orderedPaths[index] = newPath;
			} else {
				orderedPaths.push(newPath);
			}
			_updateAndSaveFilesOrder({
				...order,
				[parentPath]: orderedPaths,
			});
		},
	});
