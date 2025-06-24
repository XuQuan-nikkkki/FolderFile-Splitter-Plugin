import { StateCreator } from "zustand";

import { FFS_EXPANDED_TAG_PATHS_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";
import { removeItemFromArray, uniq } from "src/utils";

import { ExplorerStore } from "..";

import { TagNode } from ".";

export interface ToggleTagSlice {
	expandedTagPaths: string[];
	changeExpandedTagPaths: (paths: string[]) => Promise<void>;
	restoreExpandedTagPaths: () => Promise<void>;
	expandTag: (tag: TagNode) => Promise<void>;
	collapseTag: (tag: TagNode) => Promise<void>;
}

export const createToggleTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], ToggleTagSlice> =>
	(set, get) => ({
		expandedTagPaths: [],

		changeExpandedTagPaths: async (tagPaths: string[]) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "expandedTagPaths",
				value: tagPaths,
				localStorageKey: FFS_EXPANDED_TAG_PATHS_KEY,
				localStorageValue: JSON.stringify(tagPaths),
			});
		},

		expandTag: async (tag: TagNode) => {
			const { changeExpandedTagPaths, expandedTagPaths, hasTagChildren } =
				get();
			if (!hasTagChildren(tag)) return;
			await changeExpandedTagPaths(
				uniq([...expandedTagPaths, tag.fullPath])
			);
		},
		collapseTag: async (tag: TagNode) => {
			const { changeExpandedTagPaths, hasTagChildren, expandedTagPaths } =
				get();
			if (!hasTagChildren(tag)) return;
			await changeExpandedTagPaths(
				removeItemFromArray(expandedTagPaths, tag.fullPath)
			);
		},

		restoreExpandedTagPaths: async () => {
			const { getDataFromLocalStorage, hasTagChildren, tagTree } = get();
			const lastExpandedTagPaths = getDataFromLocalStorage(
				FFS_EXPANDED_TAG_PATHS_KEY
			);
			if (!lastExpandedTagPaths) return;
			try {
				const tagPaths: string[] = JSON.parse(lastExpandedTagPaths);
				set({
					expandedTagPaths: tagPaths.filter((path) => {
						const tag = tagTree.get(path);
						return tag && hasTagChildren(tag);
					}),
				});
			} catch (error) {
				console.error("Invalid Json format: ", error);
			}
		},
	});
