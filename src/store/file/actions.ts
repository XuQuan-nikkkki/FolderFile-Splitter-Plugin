import { TFile, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { isFile } from "src/utils";

import { ExplorerStore } from "..";

export interface FileActionsSlice {
	createFile: (folder: TFolder) => Promise<TFile | undefined>;
	duplicateFile: (file: TFile) => Promise<TFile>;
	trashFile: (file: TFile) => Promise<void>;
	moveFile: (file: TFile, newPath: string) => Promise<void>;
	renameFile: (file: TFile, newName: string) => Promise<void>;
	openFile: (file: TFile, focus?: boolean) => void;
	selectFile: (file: TFile, focus?: boolean) => Promise<void>;
	readFile: (file: TFile) => Promise<string>;
}

export const createFileActionsSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FileActionsSlice> =>
	(set, get) => ({
		openFile: (file: TFile, focus = true): void => {
			const leaf = plugin.app.workspace.getLeaf();
			plugin.app.workspace.setActiveLeaf(leaf, { focus });
			leaf.openFile(file, { eState: { focus } });
		},
		selectFile: async (file: TFile, focus?: boolean): Promise<void> => {
			const { setFocusedFile, openFile } = get();
			await setFocusedFile(file);
			openFile(file, focus);
		},
		readFile: async (file: TFile): Promise<string> => {
			return await plugin.app.vault.read(file);
		},
		createFile: async (folder: TFolder) => {
			const { vault } = plugin.app;
			const defaultFileName = "Untitled";
			let newFileName = defaultFileName;
			let untitledFilesCount = 0;

			folder.children.forEach((child) => {
				if (!isFile(child)) return;

				if (child.basename === newFileName) {
					untitledFilesCount++;
				} else if (child.name.startsWith(defaultFileName)) {
					const suffix = child.basename
						.replace(defaultFileName, "")
						.trim();
					const number = parseInt(suffix, 10);
					if (!isNaN(number) && number > untitledFilesCount) {
						untitledFilesCount = number;
					}
				}
			});

			if (untitledFilesCount > 0) {
				newFileName = `${defaultFileName} ${untitledFilesCount + 1}`;
			}
			try {
				const newFile = await vault.create(
					`${folder.path}/${newFileName}.md`,
					""
				);
				get().selectFile(newFile, false);
				return newFile;
			} catch (e) {
				alert(e);
			}
		},
		duplicateFile: async (file: TFile) => {
			const { vault } = plugin.app;
			const defaultFileName = file.basename;
			const folder = file.parent || plugin.app.vault.getRoot();

			const newFileName = `${defaultFileName} copy.md`;
			if (folder.children.some((child) => child.name === newFileName)) {
				alert("文件已存在，请重命名后再试。");
			}
			const newFile = await vault.copy(
				file,
				`${folder.path}/${newFileName}`
			);
			get().selectFile(newFile, false);
			return newFile;
		},
		trashFile: async (file: TFile) => {
			const { setFocusedFile, focusedFile } = get();
			const { app } = plugin;
			if (file.path === focusedFile?.path) {
				await setFocusedFile(null);
			}
			await app.fileManager.trashFile(file);
		},
		moveFile: async (file: TFile, newPath: string) => {
			await plugin.app.fileManager.renameFile(file, newPath);
		},
		renameFile: async (file: TFile, newName: string) => {
			const { moveFile } = get();
			const newPath = file.path.replace(file.basename, newName);
			await moveFile(file, newPath);
		},
	});
