import { create } from "zustand";
import { getAllTags, TFile } from "obsidian";

import FolderFileSplitterPlugin from "./main";

import { CommonExplorerStore, createCommonExplorerStore } from "./store/common";
import { createFolderExplorerStore, FolderExplorerStore } from "./store/folder";
import { createFileExplorerStore, FileExplorerStore } from "./store/file";

export type TagSortRule =
	| "TagNameAscending"
	| "TagNameDescending"
	| "FileCountAscending"
	| "FileCountDescending";
export const DEFAULT_TAG_SORT_RULE: TagSortRule = "TagNameAscending";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;

export type TagNode = {
	name: string;
	files: TFile[];
	parent: string | null;
	fullPath: string;
	children: Set<string>;
};
export type TagTree = Map<string, TagNode>;

export type ExplorerStore = CommonExplorerStore &
	FolderExplorerStore &
	FileExplorerStore & {
		tagTree: TagTree;
		tagSortRule: TagSortRule;
		expandedTagPaths: string[];
		focusedTag: TagNode | null;

		restoreData: () => Promise<void>;

		// Tags related
		generateTagTree: () => TagTree;
		getTopLevelTags: () => TagNode[];
		getFilesCountInTag: (tagNode: TagNode) => number;
		sortTags: (tags: TagNode[]) => TagNode[];
		getTagsByParent: (parentTag: string) => TagNode[];
		hasTagChildren: (tagNode: TagNode) => boolean;
	};

export const createExplorerStore = (plugin: FolderFileSplitterPlugin) =>
	create<ExplorerStore>((set, get, store) => ({
		...createCommonExplorerStore(plugin)(set, get, store),
		...createFolderExplorerStore(plugin)(set, get, store),
		...createFileExplorerStore(plugin)(set, get, store),
		tagTree: new Map(),
		tagSortRule: DEFAULT_TAG_SORT_RULE,
		expandedTagPaths: [],
		focusedTag: null,

		restoreData: async () => {
			const {
				restoreLastFocusedFolder,
				restoreLastFocusedFile,
				restoreFolderSortRule,
				restoreFileSortRule,
				restoreExpandedFolderPaths,
				restorePinnedFolders,
				restorePinnedFiles,
				generateTagTree,
			} = get();
			await Promise.all([
				restoreLastFocusedFolder(),
				restoreLastFocusedFile(),
				restoreFolderSortRule(),
				restoreFileSortRule(),
				restoreExpandedFolderPaths(),
				restorePinnedFolders(),
				restorePinnedFiles(),
				generateTagTree(),
			]);
		},

		// Tags related
		generateTagTree: () => {
			const tagTree: TagTree = new Map();
			const files = plugin.app.vault.getMarkdownFiles();
			if (!files || files.length === 0) return tagTree;

			files.forEach((file) => {
				const cache = plugin.app.metadataCache.getFileCache(file);
				if (!cache) return;

				const tags = getAllTags(cache);
				if (!tags || tags.length === 0) return;

				const getOrCreateTagNode = (
					tagName: string,
					fullPath: string,
					parent: string | null = null
				): TagNode => {
					if (!tagTree.has(fullPath)) {
						tagTree.set(fullPath, {
							name: tagName,
							files: [],
							parent,
							fullPath,
							children: new Set(),
						});
					}
					return tagTree.get(fullPath) as TagNode;
				};

				tags.forEach((tag) => {
					const tagParts = tag.replace("#", "").split("/");
					let parentTag: string | null = null;

					tagParts.forEach((part, index) => {
						const fullTagPath = tagParts
							.slice(0, index + 1)
							.join("/");
						const tagNode = getOrCreateTagNode(
							part,
							fullTagPath,
							parentTag
						);

						if (index === tagParts.length - 1) {
							tagNode.files.push(file);
						}

						if (parentTag) {
							const parentNode = tagTree.get(parentTag);
							if (parentNode) {
								parentNode.children.add(fullTagPath);
							}
						}

						parentTag = fullTagPath;
					});
				});
			});

			set({
				tagTree,
			});
			return tagTree;
		},

		getTopLevelTags: () => {
			const { tagTree } = get();
			return Array.from(tagTree.values()).filter(
				(tagNode) => !tagNode.parent
			);
		},

		getFilesCountInTag: (tagNode: TagNode): number => {
			if (!tagNode || !tagNode.files) return 0;

			const { tagTree } = get();
			const { includeSubTagFiles } = plugin.settings;
			let totalCount = tagNode.files.length;
			if (!includeSubTagFiles) return totalCount;

			tagNode.children.forEach((childTagName) => {
				const childNode = tagTree.get(childTagName);
				if (childNode) {
					totalCount += childNode.files.length;
				}
			});
			return totalCount;
		},

		sortTags: (tags: TagNode[]): TagNode[] => {
			const { getFilesCountInTag, tagSortRule: rule } = get();
			switch (rule) {
				case "TagNameAscending":
					return tags.sort((a, b) => a.name.localeCompare(b.name));
				case "TagNameDescending":
					return tags.sort((a, b) => b.name.localeCompare(a.name));
				case "FileCountAscending":
					return tags.sort(
						(a, b) => getFilesCountInTag(a) - getFilesCountInTag(b)
					);
				case "FileCountDescending":
					return tags.sort(
						(a, b) => getFilesCountInTag(b) - getFilesCountInTag(a)
					);
				default:
					return tags;
			}
		},

		getTagsByParent: (parentTag: string): TagNode[] => {
			const { tagTree } = get();
			const tags = Array.from(tagTree.values()).filter(
				(tagNode) => tagNode.parent === parentTag
			);
			return tags;
		},

		hasTagChildren: (tag: TagNode): boolean => {
			return tag.children && tag.children.size > 0;
		},
	}));
