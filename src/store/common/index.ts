import { StateCreator } from "zustand";

import { ExplorerStore } from "src/store";

import FolderFileSplitterPlugin from "../../main";

import { createLocalStorageSlice, LocalStorageSlice } from "./localStorage";
import { createManualSortSlice, ManualSortSlice } from "./manualSort";
import { createPinSlice, PinSlice } from "./pin";
import { createPluginSlice, PluginSlice } from "./plugin";
import { createViewModeSlice, ViewModeSlice } from "./viewMode";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;
export const DEFAULT_MANUAL_SORT_ORDER: ManualSortOrder = {};

export type CommonExplorerStore = ViewModeSlice &
	LocalStorageSlice &
	PluginSlice &
	ManualSortSlice &
	PinSlice;

export const createCommonExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], CommonExplorerStore> =>
	(set, get, store) => ({
		...createViewModeSlice(plugin)(set, get, store),
		...createLocalStorageSlice(plugin)(set, get, store),
		...createPluginSlice(plugin)(set, get, store),
		...createManualSortSlice(plugin)(set, get, store),
		...createPinSlice(plugin)(set, get, store),
	});

export * from "./viewMode";
export * from "./localStorage";
export * from "./plugin";
export * from "./manualSort";
