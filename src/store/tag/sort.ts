import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode } from ".";

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
			switch (rule) {
				case "FolderNameAscending":
					return tags.sort((a, b) => a.name.localeCompare(b.name));
				case "FolderNameDescending":
					return tags.sort((a, b) => b.name.localeCompare(a.name));
				case "FilesCountAscending":
					return tags.sort(
						(a, b) => getFilesCountInTag(a) - getFilesCountInTag(b)
					);
				case "FilesCountDescending":
					return tags.sort(
						(a, b) => getFilesCountInTag(b) - getFilesCountInTag(a)
					);
				default:
					return tags;
			}
		},
	});
