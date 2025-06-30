import { StateCreator } from "zustand";

import { FFS_PINNED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode } from ".";

export interface PinnedTagSlice {
	pinnedTagPaths: string[];

	getPinnedTags: () => TagNode[];
	getDisplayedPinnedTags: () => TagNode[];

	isTagPinned: (tag: TagNode) => boolean;

	setPinnedTagPathsAndSave: (tagPaths: string[]) => Promise<void>;

	pinTag: (tag: TagNode) => Promise<void>;
	unpinTag: (tag: TagNode) => Promise<void>;

	restorePinnedTags: () => Promise<void>;
}

export const createPinnedTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinnedTagSlice> =>
	(set, get) => ({
		pinnedTagPaths: [],

		getPinnedTags: () => {
			const { tagTree, pinnedTagPaths, getPinnedItems } = get();
			return getPinnedItems<TagNode>(pinnedTagPaths, (p) =>
				tagTree.get(p)
			);
		},
		getDisplayedPinnedTags: () => {
			const { showTagView } = plugin.settings;
			const { getPinnedTags } = get();
			if (!showTagView) return [];
			return getPinnedTags();
		},

		isTagPinned: (tag: TagNode) => {
			const { pinnedTagPaths, isPinned } = get();
			return isPinned(pinnedTagPaths, tag.fullPath);
		},

		setPinnedTagPathsAndSave: async (tagPaths: string[]) => {
			await get().setPinnedPathsAndSave(
				"pinnedTagPaths",
				FFS_PINNED_TAG_PATHS_KEY,
				tagPaths
			);
		},

		pinTag: async (tag: TagNode) => {
			const { pinnedTagPaths, setPinnedTagPathsAndSave, pinItem } = get();
			await pinItem(
				tag.fullPath,
				pinnedTagPaths,
				setPinnedTagPathsAndSave
			);
		},
		unpinTag: async (tag: TagNode) => {
			const { pinnedTagPaths, setPinnedTagPathsAndSave, unpinItem } =
				get();
			await unpinItem(
				tag.fullPath,
				pinnedTagPaths,
				setPinnedTagPathsAndSave
			);
		},

		restorePinnedTags: async () => {
			await get().restorePinnedPaths(
				"pinnedTagPaths",
				FFS_PINNED_TAG_PATHS_KEY
			);
		},
	});
