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
			return pinnedTagPaths
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
			await setValueAndSaveInPlugin({
				key: "pinnedTagPaths",
				value: tagPaths,
				pluginKey: FFS_PINNED_TAG_PATHS_KEY,
				pluginValue: JSON.stringify(tagPaths),
			});
		},

		pinTag: async (tagPath: string) => {
			const { pinnedTagPaths, setPinnedTagPathsAndSave } = get();
			if (pinnedTagPaths.includes(tagPath)) return;
			await setPinnedTagPathsAndSave(uniq([...pinnedTagPaths, tagPath]));
		},
		unpinTag: async (tagPath: string) => {
			const { pinnedTagPaths, setPinnedTagPathsAndSave } = get();
			if (!pinnedTagPaths.includes(tagPath)) return;
			await setPinnedTagPathsAndSave(
				uniq(removeItemFromArray(pinnedTagPaths, tagPath))
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
