import { getAllTags, TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode, TagTree } from ".";

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
		tagTree: new Map(),

		isTagValid: (tag: TagNode) => {
			return Boolean(get().getTagByPath(tag.fullPath));
		},
		hasSubTag: (tag: TagNode): boolean => {
			return tag.children?.size > 0;
		},
		isTopLevelTag: (tag: TagNode): boolean => {
			const { isTagValid, getParentTag } = get();
			return isTagValid(tag) && !getParentTag(tag);
		},
		getTopLevelTags: () => {
			const { tagTree, isTopLevelTag } = get();
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
			return tag.fullPath ? get().getTagByPath(tag.fullPath) : undefined;
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

		// TODO: 计算有问题
		getFilesInTag: (tagNode: TagNode): TFile[] => {
			if (!tagNode || !tagNode.files) return [];

			const { tagTree } = get();
			const { includeSubTagFiles } = plugin.settings;

			const files = [...tagNode.files];
			if (!includeSubTagFiles) return files;

			const getAllChildFiles = (node: TagNode): TFile[] => {
				const childFiles: TFile[] = [];
				node.children.forEach((childPath) => {
					const childNode = tagTree.get(childPath);
					if (childNode) {
						childFiles.push(...childNode.files);
					}
				});
				return childFiles;
			};

			return [...new Set([...files, ...getAllChildFiles(tagNode)])];
		},

		getFilesCountInTag: (tagNode: TagNode): number => {
			const { getFilesInTag } = get();
			return getFilesInTag(tagNode).length;
		},
	});
