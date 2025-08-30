import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOLDER_SORT_RULE_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { compareNaturalName } from "src/utils";

import { ExplorerStore } from "..";

export type FolderSortRule =
	| "FolderNameAscending"
	| "FolderNameDescending"
	| "FilesCountAscending"
	| "FilesCountDescending"
	| "FolderManualOrder";
export const DEFAULT_FOLDER_SORT_RULE: FolderSortRule = "FolderNameAscending";
export const FOLDER_MANUAL_SORT_RULE: FolderSortRule = "FolderManualOrder";

export const createFolderSorters = (
	getFilesCountInFolder: (folder: TFolder) => number
): Record<FolderSortRule, (a: TFolder, b: TFolder) => number> => ({
	FolderNameAscending: (a, b) => compareNaturalName(a.name, b.name),
	FolderNameDescending: (a, b) => compareNaturalName(b.name, a.name),
	FilesCountAscending: (a, b) =>
		getFilesCountInFolder(a) - getFilesCountInFolder(b),
	FilesCountDescending: (a, b) =>
		getFilesCountInFolder(b) - getFilesCountInFolder(a),
	FolderManualOrder: () => 0, // special case
});

export interface SortFolderSlice {
	folderSortRule: FolderSortRule;

	folderSortRulesGroup: FolderSortRule[][];

	sortFolders: (folders: TFolder[]) => TFolder[];

	changeFolderSortRule: (rule: FolderSortRule) => Promise<void>;
	changeFolderSortRuleAndUpdateOrder: (rule: FolderSortRule) => Promise<void>;
	restoreFolderSortRule: () => Promise<void>;
}

export const createSortFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], SortFolderSlice> =>
	(set, get) => ({
		folderSortRule: DEFAULT_FOLDER_SORT_RULE,

		get folderSortRulesGroup(): FolderSortRule[][] {
			return [
				["FolderNameAscending", "FolderNameDescending"],
				["FilesCountAscending", "FilesCountDescending"],
				["FolderManualOrder"],
			];
		},

		sortFolders: (folders: TFolder[]): TFolder[] => {
			const {
				getFilesCountInFolder: getFilesCount,
				foldersManualSortOrder: order,
				folderSortRule: rule,
			} = get();
			if (folders.length === 0) return folders;

			if (rule === "FolderManualOrder") {
				const parentPath = folders[0]?.parent?.path;
				if (!parentPath) return folders;

				const sortedFolderPaths = order[parentPath] ?? [];
				if (!sortedFolderPaths.length) return folders;

				const indexMap = new Map<string, number>();
				sortedFolderPaths.forEach((path, index) =>
					indexMap.set(path, index)
				);

				return [...folders].sort((a, b) => {
					const aIndex = indexMap.get(a.path);
					const bIndex = indexMap.get(b.path);

					if (aIndex === undefined && bIndex === undefined) return 0;
					if (aIndex === undefined) return 1;
					if (bIndex === undefined) return -1;
					return aIndex - bIndex;
				});
			}

			const folderSorters = createFolderSorters(getFilesCount);
			const sorter = folderSorters[rule];
			return [...folders].sort(sorter);
		},
		changeFolderSortRule: async (rule: FolderSortRule) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "folderSortRule",
				value: rule,
				pluginKey: FFS_FOLDER_SORT_RULE_KEY,
				pluginValue: rule,
			});
		},
		changeFolderSortRuleAndUpdateOrder: async (rule: FolderSortRule) => {
			const {
				folderSortRule,
				changeFolderSortRule,
				initFoldersManualSortOrder,
				clearFoldersManualOrderAndSave,
			} = get();
			if (rule !== folderSortRule) {
				await changeFolderSortRule(rule as FolderSortRule);
				if (rule === FOLDER_MANUAL_SORT_RULE) {
					await initFoldersManualSortOrder();
				} else {
					clearFoldersManualOrderAndSave();
				}
			}
		},
		restoreFolderSortRule: async () => {
			const { restoreFoldersManualSortOrder, restoreDataFromPlugin } =
				get();
			const lastFolderSortRule = await restoreDataFromPlugin({
				pluginKey: FFS_FOLDER_SORT_RULE_KEY,
				key: "folderSortRule",
			});
			if (lastFolderSortRule === FOLDER_MANUAL_SORT_RULE) {
				await restoreFoldersManualSortOrder();
			}
		},
	});
