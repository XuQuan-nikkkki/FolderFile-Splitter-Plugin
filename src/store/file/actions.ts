import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import {
	getCopyName,
	getDefaultUntitledName,
	replaceNameInPath,
} from "src/utils";

import { ExplorerStore } from "..";

export const DEFAULT_NEW_FILE_CONTENT = "";
export const MARKDOWN_FILE_EXTENSION = ".md";

export interface FileActionsSlice {
	getNewFileDefaultName: (folder: TFolder) => string;
	getDuplicateFilePath: (file: TFile) => string;

	openFile: (file: TFile, focus?: boolean) => void;
	selectFileAndOpen: (file: TFile, focus?: boolean) => void;
	readFile: (file: TFile) => Promise<string>;
	modifyFile: (file: TFile, content: string) => Promise<void>;

	createFileAndOpen: (path: string, focus?: boolean) => Promise<TFile>;
	createFileWithDefaultName: (folder: TFolder) => Promise<TFile | undefined>;
	duplicateFile: (file: TFile) => Promise<TFile>;
	isCreateFileAbled: () => boolean;

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
			return replaceNameInPath(file, copyName);
		},

		openFile: (file: TFile, active = true): void => {
			const leaf = plugin.app.workspace.getLeaf();
			leaf.openFile(file, { active });
		},
		selectFileAndOpen: (file: TFile, focus?: boolean): void => {
			const { setFocusedFileAndSave, openFile } = get();
			setFocusedFileAndSave(file);
			openFile(file, focus);
		},
		readFile: async (file: TFile): Promise<string> => {
			return await plugin.app.vault.read(file);
		},
		modifyFile: async (file: TFile, content: string) => {
			await plugin.app.vault.modify(file, content);
		},

		createFileAndOpen: async (path: string, focus?: boolean) => {
			const file = await plugin.app.vault.create(
				path,
				DEFAULT_NEW_FILE_CONTENT
			);
			get().selectFileAndOpen(file, focus);
			return file;
		},
		createFileWithDefaultName: async (folder: TFolder) => {
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
		isCreateFileAbled: () => {
			const { canCreateFilesViewModes, viewMode } = get();
			return canCreateFilesViewModes.includes(viewMode);
		},

		moveFile: async (file: TFile, newPath: string) => {
			await plugin.app.fileManager.renameFile(file, newPath);
		},
		renameFile: async (file: TFile, newName: string) => {
			const { moveFile } = get();
			const newPath = replaceNameInPath(file, newName);
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
