import { StateCreator } from "zustand";

import { FFS_PINNED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray } from "src/utils";

import { ExplorerStore } from "..";

export interface PinnedTagSlice {
	pinnedTagPaths: string[];

	isTagPinned: (tagPath: string) => boolean;
	pinTag: (tagPath: string) => Promise<void>;
	unpinTag: (tagPath: string) => Promise<void>;
	_updatePinnedTagPaths: (tagPaths: string[]) => Promise<void>;
	restorePinnedTags: () => Promise<void>;
}

export const createPinnedTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PinnedTagSlice> =>
	(set, get) => ({
		pinnedTagPaths: [],

		isTagPinned: (tagPath: string) => {
			const { pinnedTagPaths } = get();
			return pinnedTagPaths.includes(tagPath);
		},
		_updatePinnedTagPaths: async (tagPaths: string[]) => {
			const { setValueAndSaveInPlugin } = get();
			await setValueAndSaveInPlugin({
				key: "pinnedTagPaths",
				value: tagPaths,
				pluginKey: FFS_PINNED_TAG_PATHS_KEY,
				pluginValue: JSON.stringify(tagPaths),
			});
		},

		pinTag: async (tagPath: string) => {
			const { pinnedTagPaths, _updatePinnedTagPaths } = get();
			if (pinnedTagPaths.includes(tagPath)) return;
			await _updatePinnedTagPaths([...pinnedTagPaths, tagPath]);
		},
		unpinTag: async (tagPath: string) => {
			const { pinnedTagPaths, _updatePinnedTagPaths } = get();
			if (!pinnedTagPaths.includes(tagPath)) return;
			await _updatePinnedTagPaths(
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
