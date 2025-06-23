import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";

import { createFileActionsSlice, FileActionsSlice } from "./actions";
import { createFocusedFileSlice, FocusedFileSlice } from "./focus";
import { createManualSortFileSlice, ManualSortFileSlice } from "./manualSort";
import { createPinnedFileSlice, PinnedFileSlice } from "./pin";
import { createSortFileSlice, SortFileSlice } from "./sort";

export type FileExplorerStore = PinnedFileSlice &
	SortFileSlice &
	ManualSortFileSlice &
	FocusedFileSlice &
	FileActionsSlice;

export const createFileExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FileExplorerStore> =>
	(set, get, store) => ({
		...createPinnedFileSlice(plugin)(set, get, store),
		...createSortFileSlice(plugin)(set, get, store),
		...createManualSortFileSlice(plugin)(set, get, store),
		...createFileActionsSlice(plugin)(set, get, store),
		...createFocusedFileSlice(plugin)(set, get, store),
	});
