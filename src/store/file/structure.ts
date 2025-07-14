import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";
import { VIEW_MODE } from "../common";

export interface FileStructureSlice {
	getFiles: () => TFile[];
	getMarkdownFiles: () => TFile[];
	getVisibleFiles: () => TFile[];

	findFileByPath: (path: string) => TFile | null;
	isFilePathValid: (path: string) => boolean;

	isFileInFolder: (file: TFile, folder: TFolder) => boolean;
}

export const createFileStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FileStructureSlice> =>
	(set, get) => ({
		getFiles: () => plugin.app.vault.getFiles() || [],

		getMarkdownFiles: () => {
			return plugin.app.vault.getMarkdownFiles();
		},

		getVisibleFiles: () => {
			const {
				focusedFolder,
				focusedTag,
				getFilesInFolder,
				getFilesInTag,
				viewMode,
				searchResults,
			} = get();
			switch (viewMode) {
				case VIEW_MODE.ALL:
					return plugin.app.vault.getFiles();
				case VIEW_MODE.FOLDER:
					return focusedFolder ? getFilesInFolder(focusedFolder) : [];
				case VIEW_MODE.TAG:
					return focusedTag ? getFilesInTag(focusedTag) : [];
				case VIEW_MODE.SEARCH:
					return searchResults;
				default:
					return [];
			}
		},

		findFileByPath: (path: string): TFile | null => {
			return plugin.app.vault.getFileByPath(path);
		},
		isFilePathValid: (path: string) => {
			return Boolean(get().findFileByPath(path));
		},

		isFileInFolder: (file: TFile, folder: TFolder) => {
			return file.parent?.path === folder.path;
		},
	});
