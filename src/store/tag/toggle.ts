import { StateCreator } from "zustand";

import { FFS_EXPANDED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

import { TagNode } from ".";

export interface ToggleTagSlice {
	expandedTagPaths: string[];

	isTagExpanded: (tag: TagNode) => boolean;
	hasTagExpanded: () => boolean;
	canTagToggle: (tag: TagNode) => boolean;

	changeExpandedTagPaths: (paths: string[]) => void;
	expandTag: (tag: TagNode) => void;
	expandAllTags: () => void;
	collapseTag: (tag: TagNode) => void;
	collapseAllTags: () => void;

	restoreExpandedTagPaths: () => void;
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
		hasTagExpanded: () => {
			return (
				plugin.settings.showTagView && get().expandedTagPaths.length > 0
			);
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

		expandTag: (tag: TagNode) => {
			const { changeExpandedTagPaths, expandedTagPaths, canTagToggle } =
				get();
			if (!canTagToggle(tag)) return;
			changeExpandedTagPaths([...expandedTagPaths, tag.fullPath]);
		},
		expandAllTags: () => {
			const { tagTree, changeExpandedTagPaths } = get();
			changeExpandedTagPaths(Array.from(tagTree.keys()));
		},
		collapseTag: (tag: TagNode) => {
			const { changeExpandedTagPaths, canTagToggle, expandedTagPaths } =
				get();
			if (!canTagToggle(tag)) return;
			changeExpandedTagPaths(
				removeItemFromArray(expandedTagPaths, tag.fullPath)
			);
		},
		collapseAllTags: () => {
			get().changeExpandedTagPaths([]);
		},

		restoreExpandedTagPaths: () => {
			const { hasSubTag, restoreDataFromLocalStorage, getTagByPath } =
				get();
			restoreDataFromLocalStorage({
				localStorageKey: FFS_EXPANDED_TAG_PATHS_KEY,
				key: "expandedTagPaths",
				needParse: true,
				transform: (value) => {
					return (value as string[]).filter((path) => {
						const tag = getTagByPath(path);
						return tag && hasSubTag(tag);
					});
				},
			});
		},
	});
