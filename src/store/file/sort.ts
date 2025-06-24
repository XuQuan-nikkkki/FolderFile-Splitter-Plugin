import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FILE_SORT_RULE_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export type FileSortRule =
	| "FileNameAscending"
	| "FileNameDescending"
	| "FileCreatedTimeAscending"
	| "FileCreatedTimeDescending"
	| "FileModifiedTimeAscending"
	| "FileModifiedTimeDescending"
	| "FileManualOrder";
export const DEFAULT_FILE_SORT_RULE: FileSortRule = "FileNameAscending";
export const FILE_MANUAL_SORT_RULE: FileSortRule = "FileManualOrder";

export interface SortFileSlice {
	fileSortRule: FileSortRule;

	isFilesInAscendingOrder: () => boolean;
	sortFiles: (files: TFile[], rule: FileSortRule) => TFile[];
	restoreFileSortRule: () => Promise<void>;
	changeFileSortRule: (rule: FileSortRule) => Promise<void>;
}

export const createSortFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], SortFileSlice> =>
	(set, get) => ({
		fileSortRule: DEFAULT_FILE_SORT_RULE,

		isFilesInAscendingOrder: (): boolean => {
			const { fileSortRule } = get();
			return fileSortRule.contains("Ascending");
		},
		sortFiles: (files: TFile[], rule: FileSortRule): TFile[] => {
			const { filesManualSortOrder } = get();
			if (files.length === 0) return files;

			const parentPath = files[0].parent?.path;
			const filePaths = parentPath
				? filesManualSortOrder[parentPath]
				: [];
			switch (rule) {
				case "FileNameAscending":
					return files.sort((a, b) => a.name.localeCompare(b.name));
				case "FileNameDescending":
					return files.sort((a, b) => b.name.localeCompare(a.name));
				case "FileCreatedTimeAscending":
					return files.sort((a, b) => a.stat.ctime - b.stat.ctime);
				case "FileCreatedTimeDescending":
					return files.sort((a, b) => b.stat.ctime - a.stat.ctime);
				case "FileModifiedTimeAscending":
					return files.sort((a, b) => a.stat.mtime - b.stat.mtime);
				case "FileModifiedTimeDescending":
					return files.sort((a, b) => b.stat.mtime - a.stat.mtime);
				case "FileManualOrder":
					if (!parentPath || !filePaths || !filePaths.length)
						return files;
					return filePaths
						.map((path) => files.find((f) => f.path === path))
						.concat(
							files.filter((f) => !filePaths.includes(f.path))
						)
						.filter(Boolean) as TFile[];
				default:
					return files;
			}
		},
		changeFileSortRule: async (rule: FileSortRule) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "fileSortRule",
				value: rule,
				pluginKey: FFS_FILE_SORT_RULE_KEY,
				pluginValue: rule,
			});
		},
		restoreFileSortRule: async () => {
			const { restoreFilesManualSortOrder, restoreDataFromPlugin } =
				get();
			const lastFileSortRule = await restoreDataFromPlugin({
				pluginKey: FFS_FILE_SORT_RULE_KEY,
				key: "fileSortRule",
				needParse: true,
			});
			if (lastFileSortRule === FILE_MANUAL_SORT_RULE) {
				await restoreFilesManualSortOrder();
			}
		},
	});
