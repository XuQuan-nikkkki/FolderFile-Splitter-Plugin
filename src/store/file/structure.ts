import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface FileStructureSlice {
	files: TFile[];
}

export const createFileStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FileStructureSlice> =>
	(set, get) => ({
		files: plugin.app.vault.getFiles() || [],
	});
