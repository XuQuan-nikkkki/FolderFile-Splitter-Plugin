import { TAbstractFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";

import { TagNode } from "../tag";

export type PinnedItem = TAbstractFile | TagNode;

export type StructureSlice = {
	getAncestors: (item: TAbstractFile, includeRoot?: boolean) => TFolder[];
};

export const createStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], StructureSlice> =>
	(set, get) => ({
		getAncestors: (item: TAbstractFile, includeRoot = false): TFolder[] => {
			const ancestors: TFolder[] = [];
			let current = item.parent;

			while (current && !current.isRoot()) {
				ancestors.unshift(current);
				current = current.parent;
			}

			return includeRoot ? [get().rootFolder, ...ancestors] : ancestors;
		},
	});
