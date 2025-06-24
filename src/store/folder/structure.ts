import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { isFile, isFolder } from "src/utils";

import { ExplorerStore } from "..";

export interface FolderStructureSlice {
	folders: TFolder[];
	rootFolder: TFolder | null;

	getNameOfFolder: (folder: TFolder) => string;

	getTopLevelFolders: () => TFolder[];
	isTopLevelFolder: (folder: TFolder) => boolean;

	getSubFolders: (parentFolder: TFolder) => TFolder[];
	hasSubFolders: (folder: TFolder) => boolean;

	getFilesInFolder: (folder: TFolder) => TFile[];
	getFilesCountInFolder: (folder: TFolder) => number;
}

export const createFolderStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderStructureSlice> =>
	(set, get) => ({
		folders: plugin.app.vault.getAllFolders() || [],
		rootFolder: plugin.app.vault.getRoot() || null,

		getNameOfFolder: (folder: TFolder) => {
			return folder.isRoot() ? plugin.app.vault.getName() : folder.name;
		},

		isTopLevelFolder: (folder: TFolder): boolean => {
			return Boolean(folder.parent?.isRoot());
		},
		getTopLevelFolders: () => {
			const { isTopLevelFolder } = get();
			return plugin.app.vault
				.getAllFolders()
				.filter((folder) => isTopLevelFolder(folder));
		},

		hasSubFolders: (folder: TFolder): boolean => {
			return folder.children.some((child) => isFolder(child));
		},
		getSubFolders: (parentFolder: TFolder): TFolder[] => {
			return parentFolder.children.filter((child) => isFolder(child));
		},

		getFilesInFolder: (folder: TFolder): TFile[] => {
			const { includeSubfolderFiles } = plugin.settings;

			const getFiles = (folder: TFolder): TFile[] => {
				if (!folder.children) return [];

				return folder.children.reduce<TFile[]>((files, child) => {
					if (isFile(child)) {
						files.push(child as TFile);
					} else if (includeSubfolderFiles && isFolder(child)) {
						files.push(...getFiles(child as TFolder));
					}
					return files;
				}, []);
			};

			return getFiles(folder);
		},
		getFilesCountInFolder: (folder: TFolder): number => {
			const { getFilesInFolder } = get();
			return getFilesInFolder(folder).length;
		},
	});
