import { create } from "zustand";

import FolderFileSplitterPlugin from "../main";

import { CommonExplorerStore, createCommonExplorerStore } from "./common";
import { createFileExplorerStore, FileExplorerStore } from "./file";
import { createFolderExplorerStore, FolderExplorerStore } from "./folder";
import { createTagExplorerStore, TagExplorerStore } from "./tag";

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
				restorePinnedTags,
				restorePinnedFiles,
				generateTagTree,
				restoreExpandedTagPaths,
				restoreLastFocusedTag,
				restoreViewMode,
			} = get();

			generateTagTree();
			restoreViewMode();
			restoreLastFocusedFolder();
			restoreLastFocusedFile();
			restoreExpandedFolderPaths();
			restoreLastFocusedTag();
			restoreExpandedTagPaths();

			await Promise.all([
				restoreFolderSortRule(),
				restoreFileSortRule(),
				restorePinnedFolders(),
				restorePinnedTags(),
				restorePinnedFiles(),
			]);
		},
	}));
