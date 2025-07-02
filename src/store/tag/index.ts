import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";

import { createTagActionsSlice, TagActionsSlice } from "./actions";
import { createFocusedTagSlice, FocusedTagSlice } from "./focus";
import { createPinnedTagSlice, PinnedTagSlice } from "./pin";
import { createSortTagSlice, SortTagSlice } from "./sort";
import { createTagStructureSlice, TagStructureSlice } from "./structure";
import { createToggleTagSlice, ToggleTagSlice } from "./toggle";

export type TagNode = {
	name: string;
	files: TFile[];
	parentPath: string | null;
	fullPath: string;
	subTagPaths: Set<string>;
};
export type TagTree = Map<string, TagNode>;

export type TagExplorerStore = PinnedTagSlice &
	ToggleTagSlice &
	SortTagSlice &
	FocusedTagSlice &
	TagActionsSlice &
	TagStructureSlice;

export const createTagExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], TagExplorerStore> =>
	(set, get, store) => ({
		...createPinnedTagSlice(plugin)(set, get, store),
		...createToggleTagSlice(plugin)(set, get, store),
		...createSortTagSlice(plugin)(set, get, store),
		...createFocusedTagSlice(plugin)(set, get, store),
		...createTagActionsSlice(plugin)(set, get, store),
		...createTagStructureSlice(plugin)(set, get, store),
	});
