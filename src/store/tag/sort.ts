import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";
import { FolderSortRule } from "../folder/sort";

import { TagNode } from ".";

export const createTagSorters = (
	getFilesCountInTag: (tag: TagNode) => number
): Record<FolderSortRule, (a: TagNode, b: TagNode) => number> => ({
	FolderNameAscending: (a, b) => a.name.localeCompare(b.name),
	FolderNameDescending: (a, b) => b.name.localeCompare(a.name),
	FilesCountAscending: (a, b) =>
		getFilesCountInTag(a) - getFilesCountInTag(b),
	FilesCountDescending: (a, b) =>
		getFilesCountInTag(b) - getFilesCountInTag(a),
	FolderManualOrder: () => 0, // special case
});

export interface SortTagSlice {
	sortTags: (tags: TagNode[]) => TagNode[];
}

export const createSortTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], SortTagSlice> =>
	(set, get) => ({
		sortTags: (tags: TagNode[]): TagNode[] => {
			const { getFilesCountInTag, folderSortRule: rule } = get();

			const tagSorters = createTagSorters(getFilesCountInTag);
			const sorter = tagSorters[rule];
			return [...tags].sort(sorter);
		},
	});
