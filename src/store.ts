import { create } from "zustand";
import { TFile, TFolder } from "obsidian";

import FolderFileSplitterPlugin from "./main";
import { isFile, isFolder } from "./utils";
import {
	FFS_EXPANDED_FOLDER_PATHS_KEY,
	FFS_FILE_SORT_RULE_KEY,
	FFS_FOCUSED_FILE_PATH_KEY,
	FFS_FOCUSED_FOLDER_PATH_KEY,
	FFS_FOLDER_SORT_RULE_KEY,
} from "./assets/constants";

export type FolderSortRule =
	| "FolderNameAscending"
	| "FolderNameDescending"
	| "FilesCountAscending"
	| "FilesCountDescending";
export const DEFAULT_FOLDER_SORT_RULE: FolderSortRule = "FolderNameAscending";
export type FileSortRule =
	| "FileNameAscending"
	| "FileNameDescending"
	| "FileCreatedTimeAscending"
	| "FileCreatedTimeDescending"
	| "FileModifiedTimeAscending"
	| "FileModifiedTimeDescending";
const DEFAULT_FILE_SORT_RULE: FileSortRule = "FileNameAscending";

export type FileTreeStore = {
	folders: TFolder[];
	rootFolder: TFolder | null;
	focusedFolder: TFolder | null;
	focusedFile: TFile | null;
	folderSortRule: FolderSortRule;
	fileSortRule: FileSortRule;
	expandedFolderPaths: string[];

	// Folders related
	getTopLevelFolders: () => TFolder[];
	getFilesCountInFolder: (
		folder: TFolder,
		includeSubfolderFilesCount: boolean
	) => number;
	getFoldersByParent: (parentFolder: TFolder) => TFolder[];
	getDirectFilesInFolder: (folder: TFolder) => TFile[];
	hasFolderChildren: (folder: TFolder) => boolean;
	isFoldersInAscendingOrder: () => boolean;
	setFocusedFolder: (folder: TFolder | null) => void;
	_createFolder: (path: string) => Promise<TFolder>;
	createNewFolder: (parentFolder: TFolder) => Promise<TFolder | undefined>;
	setFocusedFolderAndSaveInLocalStorage: (folder: TFolder) => void;
	sortFolders: (
		folders: TFolder[],
		rule: FolderSortRule,
		includeSubfolderFilesCount: boolean
	) => TFolder[];
	changeFolderSortRule: (rule: FolderSortRule) => void;
	restoreFolderSortRule: () => void;
	changeExpandedFolderPaths: (folderNames: string[]) => void;
	restoreExpandedFolderPaths: () => void;
	restoreLastFocusedFolder: () => void;

	// Files related
	findFileByPath: (path: string) => TFile | null;
	isFilesInAscendingOrder: () => boolean;
	setFocusedFile: (file: TFile | null) => void;
	openFile: (file: TFile) => void;
	selectFile: (file: TFile) => void;
	readFile: (file: TFile) => Promise<string>;
	createFile: (folder: TFolder) => Promise<TFile>;
	duplicateFile: (file: TFile) => Promise<TFile>;
	restoreLastFocusedFile: () => void;
	changeFileSortRule: (rule: FileSortRule) => void;
	restoreFileSortRule: () => void;
	sortFiles: (files: TFile[], rule: FileSortRule) => TFile[];
};

export const createFileTreeStore = (plugin: FolderFileSplitterPlugin) =>
	create((set, get: () => FileTreeStore) => ({
		folders: plugin.app.vault.getAllFolders() || [],
		rootFolder: plugin.app.vault.getRoot() || null,
		focusedFolder: null,
		focusedFile: null,
		folderSortRule: DEFAULT_FOLDER_SORT_RULE,
		fileSortRule: DEFAULT_FILE_SORT_RULE,
		expandedFolderPaths: [],

		// Folders related
		getTopLevelFolders: () => {
			return get().folders.filter(
				(folder) => folder.parent?.parent === null
			);
		},
		hasFolderChildren: (folder: TFolder): boolean => {
			return folder.children.some((child) => isFolder(child));
		},
		getFilesCountInFolder: (
			folder: TFolder,
			includeSubfolderFilesCount: boolean
		): number => {
			const getFilesCount = (folder: TFolder): number => {
				if (!folder || !folder.children) return 0;
				return folder.children.reduce((total, child) => {
					if (isFile(child)) {
						return total + 1;
					}
					if (includeSubfolderFilesCount && isFolder(child)) {
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
		getDirectFilesInFolder: (folder: TFolder): TFile[] => {
			return folder.children.filter((child) => isFile(child));
		},
		isFoldersInAscendingOrder: (): boolean => {
			const { folderSortRule } = get();
			return folderSortRule.contains("Ascending");
		},
		setFocusedFolder: (folder: TFolder) =>
			set({
				focusedFolder: folder,
			}),
		setFocusedFolderAndSaveInLocalStorage: (folder: TFolder) => {
			const { setFocusedFolder, focusedFile, setFocusedFile } = get();
			setFocusedFolder(folder);
			localStorage.setItem(FFS_FOCUSED_FOLDER_PATH_KEY, folder.path);
			if (focusedFile?.parent?.path !== folder.path) {
				setFocusedFile(null);
			}
		},
		_createFolder: async (path: string): Promise<TFolder> => {
			const newFolder = await plugin.app.vault.createFolder(path);
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
		sortFolders: (
			folders: TFolder[],
			rule: FolderSortRule,
			includeSubfolderFilesCount: boolean
		): TFolder[] => {
			if (rule === "FolderNameAscending") {
				return folders.sort((a, b) => a.name.localeCompare(b.name));
			} else if (rule === "FolderNameDescending") {
				return folders.sort((a, b) => b.name.localeCompare(a.name));
			} else if (rule === "FilesCountAscending") {
				return folders.sort(
					(a, b) =>
						get().getFilesCountInFolder(
							a,
							includeSubfolderFilesCount
						) -
						get().getFilesCountInFolder(
							b,
							includeSubfolderFilesCount
						)
				);
			} else if (rule === "FilesCountDescending") {
				return folders.sort(
					(a, b) =>
						get().getFilesCountInFolder(
							b,
							includeSubfolderFilesCount
						) -
						get().getFilesCountInFolder(
							a,
							includeSubfolderFilesCount
						)
				);
			}
			return folders; // 如果没有匹配的规则，返回原始文件夹
		},
		changeFolderSortRule: (rule: FolderSortRule) => {
			set({
				folderSortRule: rule,
			});
			localStorage.setItem(FFS_FOLDER_SORT_RULE_KEY, rule);
		},
		restoreFolderSortRule: () => {
			const lastFolderSortRule = localStorage.getItem(
				FFS_FOLDER_SORT_RULE_KEY
			);
			if (lastFolderSortRule) {
				set({
					folderSortRule: lastFolderSortRule as FolderSortRule,
				});
			}
		},
		changeExpandedFolderPaths: (folderPaths: string[]) => {
			set({
				expandedFolderPaths: folderPaths,
			});
			localStorage.setItem(
				FFS_EXPANDED_FOLDER_PATHS_KEY,
				JSON.stringify(folderPaths)
			);
		},
		restoreExpandedFolderPaths: () => {
			const lastExpandedFolderPaths = localStorage.getItem(
				FFS_EXPANDED_FOLDER_PATHS_KEY
			);
			if (lastExpandedFolderPaths) {
				try {
					const folderPaths = JSON.parse(lastExpandedFolderPaths);
					set({
						expandedFolderPaths: folderPaths,
					});
				} catch (error) {
					console.error("Invalid Json format: ", error);
				}
			}
		},
		restoreLastFocusedFolder: () => {
			const lastFocusedFolderPath = localStorage.getItem(
				FFS_FOCUSED_FOLDER_PATH_KEY
			);
			const { rootFolder, setFocusedFolder } = get();
			if (lastFocusedFolderPath && lastFocusedFolderPath !== "/") {
				const folder = plugin.app.vault.getFolderByPath(
					lastFocusedFolderPath
				);
				if (folder) {
					setFocusedFolder(folder);
				}
			} else if (rootFolder) {
				setFocusedFolder(rootFolder);
			}
		},

		// Files related
		findFileByPath: (path: string): TFile | null => {
			return plugin.app.vault.getFileByPath(path);
		},
		isFilesInAscendingOrder: (): boolean => {
			const { fileSortRule } = get();
			return fileSortRule.contains("Ascending");
		},
		setFocusedFile: (file: TFile) =>
			set({
				focusedFile: file,
			}),
		openFile: (file: TFile): void => {
			const leaf = plugin.app.workspace.getLeaf();
			plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
			leaf.openFile(file, { eState: { focus: true } });
		},
		selectFile: (file: TFile): void => {
			const { setFocusedFile, openFile } = get();
			setFocusedFile(file);
			openFile(file);
			localStorage.setItem(FFS_FOCUSED_FILE_PATH_KEY, file.path);
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
				newFileName = `${defaultFileName} ${untitledFilesCount + 1}.md`;
			}
			const newFile = await vault.create(
				`${folder.path}/${newFileName}.md`,
				""
			);
			get().selectFile(newFile);
			return newFile;
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
			get().selectFile(newFile);
			return newFile;
		},
		restoreLastFocusedFile: () => {
			const lastFocusedFilePath = localStorage.getItem(
				FFS_FOCUSED_FILE_PATH_KEY
			);
			const { findFileByPath, selectFile } = get();
			if (lastFocusedFilePath) {
				const file = findFileByPath(lastFocusedFilePath);
				if (file) {
					selectFile(file);
				}
			}
		},
		sortFiles: (files: TFile[], rule: FileSortRule): TFile[] => {
			switch (rule) {
				case "FileNameAscending":
					return files.sort((a, b) => a.name.localeCompare(b.name));
				case "FileNameDescending":
					return files.sort((a, b) => b.name.localeCompare(a.name));
				case "FileCreatedTimeAscending":
					return files.sort((a, b) => a.stat.ctime - b.stat.ctime);
				case "FileCreatedTimeDescending":
					return files.sort((a, b) => b.stat.ctime - a.stat.ctime);
				case "FileModifiedTimeAscending":
					return files.sort((a, b) => a.stat.mtime - b.stat.mtime);
				case "FileModifiedTimeDescending":
					return files.sort((a, b) => b.stat.mtime - a.stat.mtime);
				default:
					return files;
			}
		},
		changeFileSortRule: (rule: FileSortRule) => {
			set({
				fileSortRule: rule,
			});
			localStorage.setItem(FFS_FILE_SORT_RULE_KEY, rule);
		},
		restoreFileSortRule: () => {
			const lastFileSortRule = localStorage.getItem(
				FFS_FILE_SORT_RULE_KEY
			);
			if (lastFileSortRule) {
				set({
					fileSortRule: lastFileSortRule as FileSortRule,
				});
			}
		},
	}));
