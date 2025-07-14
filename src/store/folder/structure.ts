import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { FOLDER_NOTE_LOCATION } from "src/settings";
import { isFile, isFolder } from "src/utils";

import { ExplorerStore } from "..";
import { MARKDOWN_FILE_EXTENSION } from "../file/actions";

export interface FolderStructureSlice {
	folders: TFolder[];
	foldersWithRoot: TFolder[];
	rootFolder: TFolder;

	getNameOfFolder: (folder: TFolder) => string;

	isAnscestorOf: (ancestor: TFolder, folder: TFolder) => boolean;
	getFolderLevel: (folder: TFolder) => number;

	getTopLevelFolders: () => TFolder[];
	isTopLevelFolder: (folder: TFolder) => boolean;
	isFolderPathValid: (path: string) => boolean;

	getSubFolders: (parentFolder: TFolder) => TFolder[];
	hasSubFolder: (folder: TFolder) => boolean;

	getFilesInFolder: (folder: TFolder) => TFile[];
	getFilesCountInFolder: (folder: TFolder) => number;

	getFolderNotePath: (folder: TFolder) => string;

	findFolderByPath: (path: string) => TFolder | null;
}

export const createFolderStructureSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderStructureSlice> =>
	(set, get) => ({
		folders: plugin.app.vault.getAllFolders() || [],
		foldersWithRoot: plugin.app.vault.getAllFolders(true) || [],
		rootFolder: plugin.app.vault.getRoot(),

		getNameOfFolder: (folder: TFolder) => {
			return folder.isRoot() ? plugin.app.vault.getName() : folder.name;
		},

		isAnscestorOf: (ancestor: TFolder, folder: TFolder): boolean => {
			const ancestors = get().getAncestors(folder);
			return ancestors.some((f) => f.path === ancestor.path);
		},
		getFolderLevel: (folder: TFolder) => {
			return folder.isRoot() ? 0 : folder.path.split("/").length - 1;
		},

		isFolderPathValid: (path: string) => {
			return Boolean(get().findFolderByPath(path));
		},

		isTopLevelFolder: (folder: TFolder): boolean => {
			return Boolean(folder.parent?.isRoot());
		},
		getTopLevelFolders: () => {
			const { isTopLevelFolder, folders } = get();
			return folders.filter((folder) => isTopLevelFolder(folder));
		},

		hasSubFolder: (folder: TFolder): boolean => {
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

		getFolderNotePath: (folder: TFolder): string => {
			const { folderNoteLocation, customFolderNotePath } =
				plugin.settings;
			const { INDEX_FILE, UNDERSCORE_FILE } = FOLDER_NOTE_LOCATION;

			if ([INDEX_FILE, UNDERSCORE_FILE].includes(folderNoteLocation)) {
				return `${folder.path}/${folderNoteLocation}`;
			}

			if (folderNoteLocation === FOLDER_NOTE_LOCATION.FOLDER_NAME_FILE) {
				return `${folder.path}/${folder.name}${MARKDOWN_FILE_EXTENSION}`;
			}

			return customFolderNotePath.replace("{folder}", folder.path);
		},

		findFolderByPath: (path: string): TFolder | null => {
			return plugin.app.vault.getFolderByPath(path);
		},
	});
