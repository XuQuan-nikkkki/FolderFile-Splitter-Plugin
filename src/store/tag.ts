import { StateCreator } from "zustand";
import { getAllTags, TFile } from "obsidian";

import FolderFileSplitterPlugin from "../main";
import { ExplorerStore } from "src/store";
import {
	FFS_EXPANDED_TAG_PATHS_KEY,
	FFS_FOCUSED_TAG_PATH_KEY,
	FFS_PINNED_TAG_PATHS_KEY,
} from "src/assets/constants";

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

export type TagExplorerStore = {
	tagTree: TagTree;
	expandedTagPaths: string[];
	focusedTag: TagNode | null;
	pinnedTagPaths: string[];

	generateTagTree: () => TagTree;

	markdownFiles: TFile[];
	_getOrCreateTagNode: (
		tagTree: TagTree,
		tagName: string,
		fullPath: string,
		parent: string | null
	) => TagNode;
	getTagsOfFile: (file: TFile) => string[];
	getTopLevelTags: () => TagNode[];
	getFilesInTag: (tagNode: TagNode) => TFile[];
	getFilesCountInTag: (tagNode: TagNode) => number;
	getTagsByParent: (parentTag: string) => TagNode[];
	hasTagChildren: (tagNode: TagNode) => boolean;

	sortTags: (tags: TagNode[]) => TagNode[];
	renameTag: (tag: TagNode, newName: string) => Promise<void>;

	changeExpandedTagPaths: (paths: string[]) => Promise<void>;
	restoreExpandedTagPaths: () => Promise<void>;

	_setFocusedTag: (tag: TagNode | null) => void;
	setFocusedTag: (folder: TagNode | null) => Promise<void>;
	restoreLastFocusedTag: () => Promise<void>;

	isTagPinned: (tagPath: string) => boolean;
	pinTag: (tagPath: string) => Promise<void>;
	unpinTag: (tagPath: string) => Promise<void>;
	_updatePinnedTagPaths: (tagPaths: string[]) => Promise<void>;
	restorePinnedTags: () => Promise<void>;
};

export const createTagExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], TagExplorerStore> =>
	(set, get) => ({
		tagTree: new Map(),
		expandedTagPaths: [],
		focusedTag: null,
		pinnedTagPaths: [],

		get markdownFiles() {
			return plugin.app.vault.getMarkdownFiles();
		},

		_getOrCreateTagNode: (
			tagTree: TagTree,
			tagName: string,
			fullPath: string,
			parent: string | null = null
		) => {
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

		changeExpandedTagPaths: async (tagPaths: string[]) => {
			const { saveDataInLocalStorage } = get();
			set({
				expandedTagPaths: tagPaths,
			});
			saveDataInLocalStorage(
				FFS_EXPANDED_TAG_PATHS_KEY,
				JSON.stringify(tagPaths)
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

		renameTag: async (tag: TagNode, newName: string) => {
			const files = plugin.app.vault.getMarkdownFiles();
			const oldTag = tag.fullPath;
			const parts = oldTag.split("/");
			parts[parts.length - 1] = newName;
			const newTag = parts.join("/");

			const oldTagWithHash = oldTag.startsWith("#")
				? oldTag
				: `#${oldTag}`;
			const newTagWithHash = newTag.startsWith("#")
				? newTag
				: `#${newTag}`;

			for (const file of files) {
				const content = await plugin.app.vault.read(file);

				const updated = content.replace(
					new RegExp(`(?<=\\s|^)${oldTagWithHash}(?=\\s|$)`, "g"),
					newTagWithHash
				);

				if (updated !== content) {
					await plugin.app.vault.modify(file, updated);
				}
			}
		},
		_setFocusedTag: (tag: TagNode | null) =>
			set({
				focusedTag: tag,
			}),
		setFocusedTag: async (tag: TagNode | null) => {
			const {
				_setFocusedTag,
				focusedFile,
				setFocusedFile,
				setFocusedFolder,
				saveDataInLocalStorage,
				removeDataFromLocalStorage,
			} = get();
			_setFocusedTag(tag);

			if (tag) {
				setFocusedFolder(null);
				saveDataInLocalStorage(FFS_FOCUSED_TAG_PATH_KEY, tag.fullPath);

				if (!focusedFile) return;
				const tagsOfFocusedFile =
					plugin.app.metadataCache.getFileCache(focusedFile)?.tags ??
					[];
				if (tagsOfFocusedFile.every((t) => t.tag !== tag?.fullPath)) {
					await setFocusedFile(null);
				}
			} else {
				removeDataFromLocalStorage(FFS_FOCUSED_TAG_PATH_KEY);
			}
		},

		restoreLastFocusedTag: async () => {
			const { getDataFromLocalStorage, tagTree, setFocusedTag } = get();
			const lastFocusedTagPath = getDataFromLocalStorage(
				FFS_FOCUSED_TAG_PATH_KEY
			);
			if (!lastFocusedTagPath) return;
			const tag = tagTree.get(lastFocusedTagPath);
			if (tag) {
				setFocusedTag(tag);
			}
		},

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
