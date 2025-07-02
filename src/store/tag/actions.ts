import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { Noop } from "src/utils";

import { ExplorerStore } from "..";

import { DEFAULT_TAG_TREE } from "./structure";

import { TagNode, TagTree } from ".";

export interface TagActionsSlice {
	getOrCreateTagNode: (
		tagName: string,
		fullPath: string,
		parent: string | null
	) => TagNode;
	addTagPathToTree: (path: string, file: TFile) => void;
	generateTagTree: () => TagTree;
	clearTagTree: Noop;

	completeTagPathWithHash: (path: string) => string;
	renameTag: (tag: TagNode, newName: string) => Promise<void>;
}

export const createTagActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], TagActionsSlice> =>
	(set, get) => ({
		getOrCreateTagNode: (
			tagName: string,
			fullPath: string,
			parentPath: string | null = null
		) => {
			const { tagTree, getTagByPath } = get();

			if (!getTagByPath(fullPath)) {
				tagTree.set(fullPath, {
					name: tagName,
					files: [],
					parentPath,
					fullPath,
					subTagPaths: new Set(),
				});
			}
			return getTagByPath(fullPath) as TagNode;
		},
		addTagPathToTree: (path: string, file: TFile) => {
			const { getTagPathParts, getOrCreateTagNode, getParentTag } = get();

			const parts = getTagPathParts(path);
			let parentPath: string | null = null;
			let currentPath = "";

			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				currentPath = currentPath ? `${currentPath}/${part}` : part;

				const tagNode = getOrCreateTagNode(
					part,
					currentPath,
					parentPath
				);

				if (i === parts.length - 1) {
					tagNode.files.push(file);
				}

				const parentNode = getParentTag(tagNode);
				parentNode?.subTagPaths.add(currentPath);
				parentPath = currentPath;
			}
		},
		generateTagTree: () => {
			const {
				tagTree,
				clearTagTree,
				getMarkdownFiles,
				getTagPathsOfFile,
				addTagPathToTree,
			} = get();
			clearTagTree()

			const markdownFiles = getMarkdownFiles();
			if (!markdownFiles?.length) return tagTree;

			console.log(markdownFiles.map(f => f.path).join("\n"))

			for (const file of markdownFiles) {

				const paths = getTagPathsOfFile(file);
				if (file.path === "Z-🗄️ Archive/00-🐈 小卷友/20241226-插件库的遗留问题.md") {
					console.log("paths", paths)
				}
				if (!paths?.length) continue;

				for (const tag of paths) {
					addTagPathToTree(tag, file);
				}
			}
			return tagTree;
		},
		clearTagTree: () => {
			set({
				tagTree: DEFAULT_TAG_TREE,
			});
		},

		completeTagPathWithHash: (tagPath: string) => {
			return tagPath.startsWith("#") ? tagPath : `#${tagPath}`;
		},

		renameTag: async (tag: TagNode, newName: string) => {
			const {
				getMarkdownFiles,
				readFile,
				modifyFile,
				getTagPathParts,
				completeTagPathWithHash,
			} = get();
			const files = getMarkdownFiles();

			const oldPath = tag.fullPath;
			const parts = getTagPathParts(oldPath);
			parts[parts.length - 1] = newName;
			const newPath = parts.join("/");

			const oldPathWithHash = completeTagPathWithHash(oldPath);
			const newPathWithHash = completeTagPathWithHash(newPath);

			if (oldPathWithHash === newPathWithHash) return;

			for (const file of files) {
				const content = await readFile(file);

				const updated = content.replace(
					new RegExp(`(?<=\\s|^)${oldPathWithHash}(?=\\s|$)`, "g"),
					newPathWithHash
				);

				await modifyFile(file, updated);
			}
		},
	});
