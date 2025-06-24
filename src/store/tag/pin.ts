import { StateCreator } from "zustand";

import { FFS_PINNED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

import { TagNode } from ".";

export interface PinnedTagSlice {
	pinnedTagPaths: string[];

	getPinnedTags: () => TagNode[];
	getDisplayedPinnedTags: () => TagNode[];

	isTagPinned: (tagPath: string) => boolean;

	setPinnedTagPathsAndSave: (tagPaths: string[]) => Promise<void>;

	pinTag: (tagPath: string) => Promise<void>;
	unpinTag: (tagPath: string) => Promise<void>;

	restorePinnedTags: () => Promise<void>;
}

export const createPinnedTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinnedTagSlice> =>
	(set, get) => ({
		pinnedTagPaths: [],

		getPinnedTags: () => {
			const { tagTree, pinnedTagPaths } = get();
			return uniq(pinnedTagPaths)
				.map((path) => tagTree.get(path))
				.filter(Boolean) as TagNode[];
		},
		getDisplayedPinnedTags: () => {
			const { showTagView } = plugin.settings;
			const { getPinnedTags } = get();
			if (!showTagView) return [];
			return getPinnedTags();
		},

		isTagPinned: (tagPath: string) => {
			const { pinnedTagPaths } = get();
			return pinnedTagPaths.includes(tagPath);
		},

		setPinnedTagPathsAndSave: async (tagPaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			const paths = uniq(tagPaths);
			await setValueAndSaveInPlugin({
				key: "pinnedTagPaths",
				value: paths,
				pluginKey: FFS_PINNED_TAG_PATHS_KEY,
				pluginValue: JSON.stringify(paths),
			});
		},

		pinTag: async (tagPath: string) => {
			const { pinnedTagPaths, setPinnedTagPathsAndSave, isTagPinned } =
				get();
			if (isTagPinned(tagPath)) return;
			const tagPaths = [...pinnedTagPaths, tagPath];
			await setPinnedTagPathsAndSave(tagPaths);
		},
		unpinTag: async (tagPath: string) => {
			const { pinnedTagPaths, setPinnedTagPathsAndSave, isTagPinned } =
				get();
			if (!isTagPinned(tagPath)) return;
			await setPinnedTagPathsAndSave(
				removeItemFromArray(pinnedTagPaths, tagPath)
			);
		},

		restorePinnedTags: async () => {
			const { restoreDataFromPlugin } = get();
			await restoreDataFromPlugin({
				pluginKey: FFS_PINNED_TAG_PATHS_KEY,
				key: "pinnedTagPaths",
				needParse: true,
			});
		},
	});
