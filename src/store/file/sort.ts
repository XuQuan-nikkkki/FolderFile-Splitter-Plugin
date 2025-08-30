import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FILE_SORT_RULE_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { compareNaturalName } from "src/utils";

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

const FILES_SORTERS: Record<FileSortRule, (a: TFile, b: TFile) => number> = {
	FileNameAscending: (a, b) => compareNaturalName(a.name, b.name),
	FileNameDescending: (a, b) => compareNaturalName(b.name, a.name),
	FileCreatedTimeAscending: (a, b) => a.stat.ctime - b.stat.ctime,
	FileCreatedTimeDescending: (a, b) => b.stat.ctime - a.stat.ctime,
	FileModifiedTimeAscending: (a, b) => a.stat.mtime - b.stat.mtime,
	FileModifiedTimeDescending: (a, b) => b.stat.mtime - a.stat.mtime,
	FileManualOrder: () => 0, // special case
};

export interface SortFileSlice {
	fileSortRule: FileSortRule;

	filesSortRulesGroup: FileSortRule[][];

	isFileSortDisabled: () => boolean;
	isFileSortRuleAbled: (rule: FileSortRule) => boolean;
	sortFiles: (files: TFile[]) => TFile[];
	restoreFileSortRule: () => Promise<void>;
	changeFileSortRule: (rule: FileSortRule) => Promise<void>;
	changeFileSortRuleAndUpdateOrder: (rule: FileSortRule) => Promise<void>;
}

export const createSortFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], SortFileSlice> =>
	(set, get) => ({
		fileSortRule: DEFAULT_FILE_SORT_RULE,

		get filesSortRulesGroup(): FileSortRule[][] {
			return [
				["FileNameAscending", "FileNameDescending"],
				["FileModifiedTimeAscending", "FileModifiedTimeDescending"],
				["FileCreatedTimeAscending", "FileCreatedTimeDescending"],
				["FileManualOrder"],
			];
		},

		isFileSortDisabled(): boolean {
			const { canFilesSortViewModes, viewMode } = get();
			return !canFilesSortViewModes.includes(viewMode);
		},

		isFileSortRuleAbled: (rule: FileSortRule) => {
			const {
				canFilesManualSortViewModes,
				isFileSortDisabled,
				viewMode,
			} = get();
			if (isFileSortDisabled()) return false;
			return rule === FILE_MANUAL_SORT_RULE
				? canFilesManualSortViewModes.includes(viewMode)
				: true;
		},

		sortFiles: (files: TFile[]): TFile[] => {
			const { filesManualSortOrder, fileSortRule: rule } = get();
			if (files.length === 0) return files;

			if (rule === "FileManualOrder") {
				const parentPath = files[0].parent?.path;
				if (!parentPath) return files;

				const sortedFilePaths = filesManualSortOrder[parentPath] ?? [];
				if (!sortedFilePaths.length) return files;

				return [...files].sort((a, b) => {
					const indexA = sortedFilePaths.indexOf(a.path);
					const indexB = sortedFilePaths.indexOf(b.path);

					if (indexA === -1 && indexB === -1) return 0;
					if (indexA === -1) return 1;
					if (indexB === -1) return -1;
					return indexA - indexB;
				});
			}

			const sorter = FILES_SORTERS[rule];
			return [...files].sort(sorter);
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
		changeFileSortRuleAndUpdateOrder: async (rule: FileSortRule) => {
			const {
				fileSortRule,
				changeFileSortRule,
				initFilesManualSortOrder,
				clearFileManualOrderAndSave,
			} = get();
			if (rule !== fileSortRule) {
				await changeFileSortRule(rule);
				if (rule === FILE_MANUAL_SORT_RULE) {
					await initFilesManualSortOrder();
				} else {
					await clearFileManualOrderAndSave();
				}
			}
		},
		restoreFileSortRule: async () => {
			const { restoreFilesManualSortOrder, restoreDataFromPlugin } =
				get();
			const lastFileSortRule = await restoreDataFromPlugin({
				pluginKey: FFS_FILE_SORT_RULE_KEY,
				key: "fileSortRule",
			});
			if (lastFileSortRule === FILE_MANUAL_SORT_RULE) {
				await restoreFilesManualSortOrder();
			}
		},
	});
