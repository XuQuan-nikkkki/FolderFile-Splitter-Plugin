import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode, TagTree } from ".";

export interface TagActionsSlice {
		_getOrCreateTagNode: (
			tagTree: TagTree,
			tagName: string,
			fullPath: string,
			parent: string | null
		) => TagNode;
		renameTag: (tag: TagNode, newName: string) => Promise<void>;
}

export const createTagActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], TagActionsSlice> =>
	(set, get) => ({
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
	});
