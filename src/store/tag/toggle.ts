import { StateCreator } from "zustand";

import { FFS_EXPANDED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

import { TagNode } from ".";

export interface ToggleTagSlice {
	expandedTagPaths: string[];

	isTagExpanded: (tag: TagNode) => boolean;
	canTagToggle: (tag: TagNode) => boolean;

	changeExpandedTagPaths: (paths: string[]) => void;
	expandTag: (tag: TagNode) => Promise<void>;
	collapseTag: (tag: TagNode) => Promise<void>;

	restoreExpandedTagPaths: () => Promise<void>;
}

export const createToggleTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ToggleTagSlice> =>
	(set, get) => ({
		expandedTagPaths: [],

		isTagExpanded: (tag: TagNode) => {
			return get().expandedTagPaths.includes(tag.fullPath);
		},
		canTagToggle: (tag: TagNode) => {
			return get().hasSubTag(tag);
		},

		changeExpandedTagPaths: (tagPaths: string[]) => {
			const { setValueAndSaveInLocalStorage } = get();
			const paths = uniq(tagPaths);
			setValueAndSaveInLocalStorage({
				key: "expandedTagPaths",
				value: paths,
				localStorageKey: FFS_EXPANDED_TAG_PATHS_KEY,
				localStorageValue: JSON.stringify(paths),
			});
		},

		expandTag: async (tag: TagNode) => {
			const { changeExpandedTagPaths, expandedTagPaths, canTagToggle } =
				get();
			if (!canTagToggle(tag)) return;
			await changeExpandedTagPaths([...expandedTagPaths, tag.fullPath]);
		},
		collapseTag: async (tag: TagNode) => {
			const { changeExpandedTagPaths, canTagToggle, expandedTagPaths } =
				get();
			if (!canTagToggle(tag)) return;
			await changeExpandedTagPaths(
				removeItemFromArray(expandedTagPaths, tag.fullPath)
			);
		},

		restoreExpandedTagPaths: async () => {
			const { hasSubTag, tagTree, restoreDataFromLocalStorage } = get();
			restoreDataFromLocalStorage({
				localStorageKey: FFS_EXPANDED_TAG_PATHS_KEY,
				key: "expandedTagPaths",
				needParse: true,
				transform: (value) => {
					return (value as string[]).filter((path) => {
						const tag = tagTree.get(path);
						return tag && hasSubTag(tag);
					});
				},
			});
		},
	});
