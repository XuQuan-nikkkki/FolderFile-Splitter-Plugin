import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";

import { createFolderActionsSlice, FolderActionsSlice } from "./actions";
import { createFocusedFolderSlice, FocusedFolderSlice } from "./focus";
import {
	createManualSortFolderSlice,
	ManualSortFolderSlice,
} from "./manualSort";
import { createPinnedFolderSlice, PinnedFolderSlice } from "./pin";
import { createSortFolderSlice, SortFolderSlice } from "./sort";
import { createFolderStructureSlice, FolderStructureSlice } from "./structure";
import { createToggleFolderSlice, ToggleFolderSlice } from "./toggle";

export type FolderExplorerStore = FolderStructureSlice &
	PinnedFolderSlice &
	SortFolderSlice &
	ManualSortFolderSlice &
	ToggleFolderSlice &
	FolderActionsSlice &
	FocusedFolderSlice;

export const createFolderExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderExplorerStore> =>
	(set, get, store) => ({
		...createPinnedFolderSlice(plugin)(set, get, store),
		...createSortFolderSlice(plugin)(set, get, store),
		...createManualSortFolderSlice(plugin)(set, get, store),
		...createToggleFolderSlice(plugin)(set, get, store),
		...createFolderActionsSlice(plugin)(set, get, store),
		...createFocusedFolderSlice(plugin)(set, get, store),
		...createFolderStructureSlice(plugin)(set, get, store),
	});
