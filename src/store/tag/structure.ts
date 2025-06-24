import { getAllTags, TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode, TagTree } from ".";
import { removeItemFromArray } from "src/utils";


export interface TagStructureSlice {
	tagTree: TagTree;

	generateTagTree: () => TagTree;

	markdownFiles: TFile[];

	getTagsOfFile: (file: TFile) => string[];
	getTopLevelTags: () => TagNode[];
	isTopLevelTag: (tagNode: TagNode) => boolean;
	getFilesInTag: (tagNode: TagNode) => TFile[];
	getFilesCountInTag: (tagNode: TagNode) => number;
	getTagsByParent: (parentTag: string) => TagNode[];
	hasTagChildren: (tagNode: TagNode) => boolean;
}

export const createTagStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], TagStructureSlice> =>
	(set, get) => ({
		tagTree: new Map(),

		get markdownFiles() {
			return plugin.app.vault.getMarkdownFiles();
		},

		getTagsOfFile: (file: TFile) => {
			const cache = plugin.app.metadataCache.getFileCache(file);
			if (!cache) return [];
			return [...new Set(getAllTags(cache))];
		},

		generateTagTree: () => {
			const { _getOrCreateTagNode, markdownFiles, getTagsOfFile } = get();

			const tagTree: TagTree = new Map();
			if (!markdownFiles || markdownFiles.length === 0) return tagTree;

			markdownFiles.forEach((file) => {
				const tags = getTagsOfFile(file);
				if (!tags || tags.length === 0) return;

				tags.forEach((tag) => {
					const tagParts = tag.replace("#", "").split("/");
					let parentTag: string | null = null;

					tagParts.forEach((part, index) => {
						const fullTagPath = tagParts
							.slice(0, index + 1)
							.join("/");
						const tagNode = _getOrCreateTagNode(
							tagTree,
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

		isTopLevelTag: (tagNode: TagNode): boolean => {
			const { tagTree } = get();
			return tagNode && !tagNode.parent && tagTree.has(tagNode.fullPath);
		},

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
  });
