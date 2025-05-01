import { create } from "zustand";

import FolderFileSplitterPlugin from "./main";

import { CommonExplorerStore, createCommonExplorerStore } from "./store/common";
import { createFolderExplorerStore, FolderExplorerStore } from "./store/folder";
import { createFileExplorerStore, FileExplorerStore } from "./store/file";
import { createTagExplorerStore, TagExplorerStore } from "./store/tag";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;

export type ExplorerStore = CommonExplorerStore &
	FolderExplorerStore &
	FileExplorerStore &
	TagExplorerStore & {
		restoreData: () => Promise<void>;
	};

export const createExplorerStore = (plugin: FolderFileSplitterPlugin) =>
	create<ExplorerStore>((set, get, store) => ({
		...createCommonExplorerStore(plugin)(set, get, store),
		...createFolderExplorerStore(plugin)(set, get, store),
		...createFileExplorerStore(plugin)(set, get, store),
		...createTagExplorerStore(plugin)(set, get, store),

		restoreData: async () => {
			const {
				restoreLastFocusedFolder,
				restoreLastFocusedFile,
				restoreFolderSortRule,
				restoreFileSortRule,
				restoreExpandedFolderPaths,
				restorePinnedFolders,
				restorePinnedFiles,
				generateTagTree,
			} = get();
			await Promise.all([
				restoreLastFocusedFolder(),
				restoreLastFocusedFile(),
				restoreFolderSortRule(),
				restoreFileSortRule(),
				restoreExpandedFolderPaths(),
				restorePinnedFolders(),
				restorePinnedFiles(),
				generateTagTree(),
			]);
		},
	}));
