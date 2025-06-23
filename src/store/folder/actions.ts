import { TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { isFolder } from "src/utils";

import { ExplorerStore } from "..";

export interface FolderActionsSlice {
	latestCreatedFolder: TFolder | null;
	latestFolderCreatedTime: number | null;
	_createFolder: (path: string) => Promise<TFolder>;
	createNewFolder: (parentFolder: TFolder) => Promise<TFolder | undefined>;
	trashFolder: (folder: TFolder) => Promise<void>;
	moveFolder: (folder: TFolder, newPath: string) => Promise<void>;
	renameFolder: (folder: TFolder, newName: string) => Promise<void>;
}

export const createFolderActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderActionsSlice> =>
	(set, get) => ({
		latestCreatedFolder: null,
		latestFolderCreatedTime: null,

		_createFolder: async (path: string): Promise<TFolder> => {
			const newFolder = await plugin.app.vault.createFolder(path);
			set({
				latestCreatedFolder: newFolder,
				latestFolderCreatedTime: Date.now(),
			});
			return newFolder;
		},
		createNewFolder: async (
			parentFolder: TFolder
		): Promise<TFolder | undefined> => {
			const { rootFolder, _createFolder } = get();
			if (!rootFolder) return;

			const baseFolderName = "Untitled";
			let newFolderName = baseFolderName;
			let untitledFoldersCount = 0;

			parentFolder.children.forEach((child) => {
				if (!isFolder(child)) return;

				if (child.name === newFolderName) {
					untitledFoldersCount++;
				} else if (child.name.startsWith(baseFolderName)) {
					const suffix = child.name
						.replace(baseFolderName, "")
						.trim();
					const number = parseInt(suffix, 10);
					if (!isNaN(number) && number > untitledFoldersCount) {
						untitledFoldersCount = number;
					}
				}
			});

			if (untitledFoldersCount > 0) {
				newFolderName = `${baseFolderName} ${untitledFoldersCount + 1}`;
			}

			const newFolder = await _createFolder(
				`${parentFolder.path}/${newFolderName}`
			);
			return newFolder;
		},
		trashFolder: async (folder: TFolder) => {
			const { focusedFolder, setFocusedFolder } = get();
			const { app } = plugin;
			const focusedFolderPaths = focusedFolder?.path.split("/") ?? [];
			if (focusedFolderPaths.includes(folder.path)) {
				setFocusedFolder(null);
			}
			await app.fileManager.trashFile(folder);
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
