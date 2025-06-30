import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { getCopyName, getDefaultUntitledName } from "src/utils";

import { ExplorerStore } from "..";

export const DEFAULT_NEW_FILE_CONTENT = "";
export const MARKDOWN_FILE_EXTENSION = ".md";

export interface FileActionsSlice {
	getNewFileDefaultName: (folder: TFolder) => string;
	getDuplicateFilePath: (file: TFile) => string;

	openFile: (file: TFile, focus?: boolean) => void;
	selectFileAndOpen: (file: TFile, focus?: boolean) => void;
	readFile: (file: TFile) => Promise<string>;

	createFileAndOpen: (path: string, focus?: boolean) => Promise<TFile>;
	createFile: (folder: TFolder) => Promise<TFile | undefined>;
	duplicateFile: (file: TFile) => Promise<TFile>;

	moveFile: (file: TFile, newPath: string) => Promise<void>;
	renameFile: (file: TFile, newName: string) => Promise<void>;

	trashFile: (file: TFile) => Promise<void>;
}

export const createFileActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FileActionsSlice> =>
	(set, get) => ({
		getNewFileDefaultName: (folder: TFolder): string => {
			const files = get().getFilesInFolder(folder);
			return getDefaultUntitledName(files.map((file) => file.basename));
		},

		getDuplicateFilePath: (file: TFile): string => {
			const { getFilesInFolder, rootFolder } = get();
			const defaultFileName = file.basename;
			const files = getFilesInFolder(file.parent || rootFolder);
			const copyName = getCopyName(
				files.map((f) => f.name),
				defaultFileName
			);
			return file.path.replace(file.basename, copyName);
		},

		openFile: (file: TFile, focus = true): void => {
			const { workspace } = plugin.app;
			const { getLeaf, setActiveLeaf } = workspace;

			const leaf = getLeaf();
			setActiveLeaf(leaf, { focus });
			leaf.openFile(file, { eState: { focus } });
		},
		selectFileAndOpen: (file: TFile, focus?: boolean): void => {
			const { setFocusedFileAndSave, openFile } = get();
			setFocusedFileAndSave(file);
			openFile(file, focus);
		},
		readFile: async (file: TFile): Promise<string> => {
			return await plugin.app.vault.read(file);
		},

		createFileAndOpen: async (path: string, focus?: boolean) => {
			const file = await plugin.app.vault.create(
				path,
				DEFAULT_NEW_FILE_CONTENT
			);
			get().selectFileAndOpen(file, focus);
			return file;
		},
		createFile: async (folder: TFolder) => {
			const { createFileAndOpen, getNewFileDefaultName } = get();
			const newFileName = getNewFileDefaultName(folder);
			const filePath = `${folder.path}/${newFileName}${MARKDOWN_FILE_EXTENSION}`;
			const newFile = await createFileAndOpen(filePath, false);
			return newFile;
		},
		duplicateFile: async (file: TFile) => {
			const { selectFileAndOpen, getDuplicateFilePath } = get();
			const newFilePath = getDuplicateFilePath(file);
			const newFile = await plugin.app.vault.copy(file, newFilePath);
			selectFileAndOpen(newFile, false);
			return newFile;
		},

		moveFile: async (file: TFile, newPath: string) => {
			await plugin.app.fileManager.renameFile(file, newPath);
		},
		renameFile: async (file: TFile, newName: string) => {
			const { moveFile } = get();
			const newPath = file.path.replace(file.basename, newName);
			await moveFile(file, newPath);
		},

		trashFile: async (file: TFile) => {
			const { setFocusedFileAndSave, focusedFile } = get();

			await plugin.app.fileManager.trashFile(file);
			if (file.path === focusedFile?.path) {
				setFocusedFileAndSave(null);
			}
		},
	});
