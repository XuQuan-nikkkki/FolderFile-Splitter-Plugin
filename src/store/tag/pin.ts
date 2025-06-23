import { StateCreator } from "zustand";

import { FFS_PINNED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

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
			const { saveDataInPlugin } = get();
			set({
				pinnedTagPaths: tagPaths,
			});
			saveDataInPlugin({
				[FFS_PINNED_TAG_PATHS_KEY]: JSON.stringify(tagPaths),
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
				pinnedTagPaths.filter((path) => path !== tagPath)
			);
		},
		restorePinnedTags: async () => {
			const { getDataFromPlugin: getData } = get();
			const pinnedTagPaths = await getData<string>(
				FFS_PINNED_TAG_PATHS_KEY
			);
			if (!pinnedTagPaths) return;
			try {
				const tagPaths: string[] = JSON.parse(pinnedTagPaths);
				set({
					pinnedTagPaths: tagPaths,
				});
			} catch (error) {
				console.error("Invalid Json format: ", error);
			}
		},
	});
