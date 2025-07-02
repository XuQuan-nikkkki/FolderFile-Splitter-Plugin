import { getAllTags, TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode, TagTree } from ".";

export const DEFAULT_TAG_TREE = new Map();

export interface TagStructureSlice {
	tagTree: TagTree;

	isTagValid: (tag: TagNode) => boolean;
	hasSubTag: (tagNode: TagNode) => boolean;
	isTopLevelTag: (tagNode: TagNode) => boolean;
	getTopLevelTags: () => TagNode[];

	getTagPathParts: (path: string) => string[];
	getTagByPath: (path: string) => TagNode | undefined;
	getTagsByParent: (parentTag: string) => TagNode[];
	getParentTag: (tag: TagNode) => TagNode | undefined;
	getTagAncestors: (tag: TagNode) => TagNode[];

	getTagPathsOfFile: (file: TFile) => string[];
	getTagsOfFile: (file: TFile) => TagNode[];
	isFileHasTag: (file: TFile, tag: TagNode) => boolean;

	getFilesInTag: (tagNode: TagNode) => TFile[];
	getFilesCountInTag: (tagNode: TagNode) => number;
}

export const createTagStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], TagStructureSlice> =>
	(set, get) => ({
		tagTree: DEFAULT_TAG_TREE,

		isTagValid: (tag: TagNode) => {
			return Boolean(get().getTagByPath(tag.fullPath));
		},
		hasSubTag: (tag: TagNode): boolean => {
			return tag.subTagPaths?.size > 0;
		},
		isTopLevelTag: (tag: TagNode): boolean => {
			const { isTagValid, getParentTag } = get();
			return isTagValid(tag) && !getParentTag(tag);
		},
		getTopLevelTags: () => {
			const { tagTree, isTopLevelTag } = get();
			// console.log(tagTree)
			return Array.from(tagTree.values()).filter(isTopLevelTag);
		},

		getTagPathParts: (path: string) => {
			return path.replace(/^#/, "").split("/");
		},
		getTagByPath: (path: string) => {
			return get().tagTree.get(path);
		},
		getTagsByParent: (parentTag: string): TagNode[] => {
			const { tagTree } = get();
			const tags = Array.from(tagTree.values()).filter(
				(tagNode) => tagNode.parentPath === parentTag
			);
			return tags;
		},
		getParentTag: (tag: TagNode) => {
			return tag.parentPath
				? get().getTagByPath(tag.parentPath)
				: undefined;
		},
		getTagAncestors: (tag: TagNode) => {
			const { getParentTag } = get();
			const ancestors: TagNode[] = [];
			let current = getParentTag(tag);

			while (current) {
				ancestors.unshift(current);
				current = getParentTag(current);
			}
			return ancestors;
		},

		getTagPathsOfFile: (file: TFile) => {
			const cache = plugin.app.metadataCache.getFileCache(file);
			if (!cache) return [];
			return [...new Set(getAllTags(cache))];
		},
		getTagsOfFile: (file: TFile) => {
			const { getTagPathsOfFile, getTagByPath } = get();
			const paths = getTagPathsOfFile(file);
			return paths.map(getTagByPath).filter(Boolean) as TagNode[];
		},
		isFileHasTag: (file: TFile, tag: TagNode) => {
			const { getTagsOfFile } = get();
			const tags = getTagsOfFile(file);
			return tags.some((t) => t.fullPath === tag.fullPath);
		},

		getFilesInTag: (tagNode: TagNode): TFile[] => {
			const { includeSubTagFiles } = plugin.settings;
			const { getTagByPath } = get();

			const visited = new Set<string>();

			const getFiles = (tag: TagNode): TFile[] => {
				if (visited.has(tag.fullPath)) return [];
				visited.add(tag.fullPath);

				const allFiles = [...tag.files];

				if (!includeSubTagFiles) return allFiles;

				for (const subTagPath of tag.subTagPaths) {
					const subTag = getTagByPath(subTagPath);
					if (subTag) {
						allFiles.push(...getFiles(subTag));
					}
				}

				return allFiles;
			};

			return getFiles(tagNode);
		},

		getFilesCountInTag: (tagNode: TagNode): number => {
			const { getFilesInTag } = get();
			return getFilesInTag(tagNode).length;
		},
	});
