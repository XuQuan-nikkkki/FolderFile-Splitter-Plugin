import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOLDER_SORT_RULE_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export type FolderSortRule =
	| "FolderNameAscending"
	| "FolderNameDescending"
	| "FilesCountAscending"
	| "FilesCountDescending"
	| "FolderManualOrder";
export const DEFAULT_FOLDER_SORT_RULE: FolderSortRule = "FolderNameAscending";
export const FOLDER_MANUAL_SORT_RULE: FolderSortRule = "FolderManualOrder";

export interface SortFolderSlice {
	folderSortRule: FolderSortRule;

	isFoldersInAscendingOrder: () => boolean;
	sortFolders: (
		folders: TFolder[],
		rule: FolderSortRule,
		includeSubfolderFiles: boolean
	) => TFolder[];
	changeFolderSortRule: (rule: FolderSortRule) => Promise<void>;
	restoreFolderSortRule: () => Promise<void>;
}

export const createSortFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], SortFolderSlice> =>
	(set, get) => ({
		folderSortRule: DEFAULT_FOLDER_SORT_RULE,

		isFoldersInAscendingOrder: (): boolean => {
			const { folderSortRule } = get();
			return folderSortRule.contains("Ascending");
		},
		sortFolders: (
			folders: TFolder[],
			rule: FolderSortRule,
			includeSubfolder: boolean
		): TFolder[] => {
			const {
				getFilesCountInFolder: getFilesCount,
				foldersManualSortOrder: order,
			} = get();
			const parentPath = folders[0]?.parent?.path;
			const folderPaths = parentPath ? order[parentPath] : [];
			switch (rule) {
				case "FolderNameAscending":
					return folders.sort((a, b) => a.name.localeCompare(b.name));
				case "FolderNameDescending":
					return folders.sort((a, b) => b.name.localeCompare(a.name));
				case "FilesCountAscending":
					return folders.sort(
						(a, b) =>
							getFilesCount(a, includeSubfolder) -
							getFilesCount(b, includeSubfolder)
					);
				case "FilesCountDescending":
					return folders.sort(
						(a, b) =>
							getFilesCount(b, includeSubfolder) -
							getFilesCount(a, includeSubfolder)
					);
				case "FolderManualOrder":
					if (!parentPath || !folderPaths || !folderPaths.length)
						return folders;
					return folderPaths
						.map((path) => folders.find((f) => f.path === path))
						.concat(
							folders.filter((f) => !folderPaths.includes(f.path))
						)
						.filter(Boolean) as TFolder[];
				default:
					return folders;
			}
		},
		changeFolderSortRule: async (rule: FolderSortRule) => {
			set({
				folderSortRule: rule,
			});
			await get().saveDataInPlugin({ [FFS_FOLDER_SORT_RULE_KEY]: rule });
		},
		restoreFolderSortRule: async () => {
			const { restoreFoldersManualSortOrder, getDataFromPlugin } = get();
			const lastFolderSortRule = await getDataFromPlugin<FolderSortRule>(
				FFS_FOLDER_SORT_RULE_KEY
			);
			if (!lastFolderSortRule) return;
			set({
				folderSortRule: lastFolderSortRule,
			});
			if (lastFolderSortRule === FOLDER_MANUAL_SORT_RULE) {
				await restoreFoldersManualSortOrder();
			}
		},
	});
