import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { getDefaultUntitledName, replaceNameInPath } from "src/utils";

import { ExplorerStore } from "..";

export interface FolderActionsSlice {
	latestCreatedFolderPath: string | null;
	latestFolderCreatedTime: number | null;

	getNewFolderDefaultName: (parentFolder: TFolder) => string;
	getTargetFolder: () => TFolder;
	isLastCreatedFolder: (folder: TFolder) => boolean;

	createNewFolder: (parentFolder: TFolder) => Promise<TFolder | undefined>;
	createNewFolderAndFocus: (parentFolder: TFolder) => Promise<void>;
	createNewFileAndFocus: (parentFolder: TFolder) => Promise<void>;

	moveFolder: (folder: TFolder, newPath: string) => Promise<void>;
	renameFolder: (folder: TFolder, newName: string) => Promise<void>;

	trashFolder: (folder: TFolder) => Promise<void>;
}

export const createFolderActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderActionsSlice> =>
	(set, get) => ({
		latestCreatedFolderPath: null,
		latestFolderCreatedTime: null,

		getNewFolderDefaultName: (parentFolder: TFolder): string => {
			const subfolders = get().getSubFolders(parentFolder);
			return getDefaultUntitledName(
				subfolders.map((folder) => folder.name)
			);
		},
		getTargetFolder: () => {
			const { focusedFolder, rootFolder } = get();
			return focusedFolder || rootFolder;
		},

		isLastCreatedFolder: (folder: TFolder): boolean => {
			const { latestCreatedFolderPath, latestFolderCreatedTime } = get();
			const now = Date.now();
			return Boolean(
				folder.path === latestCreatedFolderPath &&
					latestFolderCreatedTime &&
					now - latestFolderCreatedTime < 3000
			);
		},

		createNewFolder: async (
			parentFolder: TFolder
		): Promise<TFolder | undefined> => {
			const { getNewFolderDefaultName } = get();

			const newFolderName = getNewFolderDefaultName(parentFolder);
			const newFolder = await plugin.app.vault.createFolder(
				`${parentFolder.path}/${newFolderName}`
			);
			set({
				latestCreatedFolderPath: newFolder.path,
				latestFolderCreatedTime: Date.now(),
			});
			return newFolder;
		},
		createNewFolderAndFocus: async (parentFolder: TFolder) => {
			const { createNewFolder, expandAncestors, changeFocusedFolder } =
				get();
			const newFolder = await createNewFolder(parentFolder);
			if (newFolder) {
				expandAncestors(newFolder);
				await changeFocusedFolder(newFolder);
			}
		},
		createNewFileAndFocus: async (parentFolder: TFolder) => {
			const { createFileWithDefaultName, changeFocusedFolder } = get();
			await createFileWithDefaultName(parentFolder);
			await changeFocusedFolder(parentFolder);
		},
		trashFolder: async (folder: TFolder) => {
			const {
				focusedFolder,
				focusedFile,
				isAnscestorOf,
				isFocusedFolder,
				setFocusedFolderAndSave,
				isFileInFolder,
				clearFocusedFile,
				changeToAllMode,
			} = get();

			if (
				focusedFolder &&
				(isAnscestorOf(folder, focusedFolder) ||
					isFocusedFolder(folder))
			) {
				setFocusedFolderAndSave(null);
				changeToAllMode();
			}
			if (focusedFile && isFileInFolder(focusedFile, folder)) {
				clearFocusedFile();
			}
			await plugin.app.fileManager.trashFile(folder);
		},

		moveFolder: async (folder: TFolder, newPath: string) => {
			await plugin.app.vault.rename(folder, newPath);
		},
		renameFolder: async (folder: TFolder, newName: string) => {
			const { moveFolder } = get();
			const newPath = replaceNameInPath(folder, newName)
			await moveFolder(folder, newPath);
		},
	});
