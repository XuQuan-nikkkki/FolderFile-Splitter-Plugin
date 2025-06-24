import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { isFile, isFolder } from "src/utils";

import { ExplorerStore } from "..";

export interface FolderStructureSlice {
	folders: TFolder[];
	rootFolder: TFolder | null;

	getTopLevelFolders: () => TFolder[];
	isTopLevelFolder: (folder: TFolder) => boolean;
	getFilesCountInFolder: (
		folder: TFolder,
		includeSubfolderFiles: boolean
	) => number;
	getFoldersByParent: (parentFolder: TFolder) => TFolder[];
	getFilesInFolder: (folder: TFolder, getFilesInFolder?: boolean) => TFile[];
	hasFolderChildren: (folder: TFolder) => boolean;
	getNameOfFolder: (folder: TFolder) => string;
}

export const createFolderStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderStructureSlice> =>
	(set, get) => ({
		folders: plugin.app.vault.getAllFolders() || [],
		rootFolder: plugin.app.vault.getRoot() || null,

		isTopLevelFolder: (folder: TFolder): boolean => {
			return Boolean(folder.parent?.isRoot());
		},
		getTopLevelFolders: () => {
			const {isTopLevelFolder } = get();
			return plugin.app.vault
				.getAllFolders()
				.filter((folder) => isTopLevelFolder(folder));
		},
		hasFolderChildren: (folder: TFolder): boolean => {
			return folder.children.some((child) => isFolder(child));
		},
		getFilesCountInFolder: (
			folder: TFolder,
			includeSubfolderFiles: boolean
		): number => {
			const getFilesCount = (folder: TFolder): number => {
				if (!folder || !folder.children) return 0;
				return folder.children.reduce((total, child) => {
					if (isFile(child)) {
						return total + 1;
					}
					if (includeSubfolderFiles && isFolder(child)) {
						return total + getFilesCount(child);
					}
					return total;
				}, 0);
			};
			return getFilesCount(folder);
		},
		getFoldersByParent: (parentFolder: TFolder): TFolder[] => {
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

		getNameOfFolder: (folder: TFolder) => {
			return folder.isRoot() ? plugin.app.vault.getName() : folder.name;
		},
	});
