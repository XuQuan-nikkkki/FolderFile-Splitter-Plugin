import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { getDefaultUntitledName } from "src/utils";

import { ExplorerStore } from "..";

export interface FolderActionsSlice {
	latestCreatedFolder: TFolder | null;
	latestFolderCreatedTime: number | null;

	getNewFolderDefaultName: (parentFolder: TFolder) => string;

	createNewFolder: (parentFolder: TFolder) => Promise<TFolder | undefined>;

	moveFolder: (folder: TFolder, newPath: string) => Promise<void>;
	renameFolder: (folder: TFolder, newName: string) => Promise<void>;

	trashFolder: (folder: TFolder) => Promise<void>;
}

export const createFolderActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderActionsSlice> =>
	(set, get) => ({
		latestCreatedFolder: null,
		latestFolderCreatedTime: null,

		getNewFolderDefaultName: (parentFolder: TFolder): string => {
			const subfolders = get().getSubFolders(parentFolder);
			return getDefaultUntitledName(
				subfolders.map((folder) => folder.name)
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
				latestCreatedFolder: newFolder,
				latestFolderCreatedTime: Date.now(),
			});
			return newFolder;
		},
		trashFolder: async (folder: TFolder) => {
			const { focusedFolder, isAnscestorOf, setFocusedFolderAndSave } =
				get();

			if (focusedFolder && isAnscestorOf(folder, focusedFolder)) {
				setFocusedFolderAndSave(null);
			}
			await plugin.app.fileManager.trashFile(folder);
		},

		moveFolder: async (folder: TFolder, newPath: string) => {
			await plugin.app.vault.rename(folder, newPath);
		},
		renameFolder: async (folder: TFolder, newName: string) => {
			const { moveFolder } = get();
			const newPath = folder.path.replace(folder.name, newName);
			await moveFolder(folder, newPath);
		},
	});
