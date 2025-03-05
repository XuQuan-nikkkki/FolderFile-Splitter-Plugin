import { create } from "zustand";
import { TFile, TFolder } from "obsidian";

import FolderFileSplitterPlugin from "./main";
import { isAbstractFileIncluded, isFile, isFolder } from "./utils";
import {
	FFS_EXPANDED_FOLDER_PATHS_KEY,
	FFS_FILE_SORT_RULE_KEY,
	FFS_FOCUSED_FILE_PATH_KEY,
	FFS_FOCUSED_FOLDER_PATH_KEY,
	FFS_FOLDER_SORT_RULE_KEY,
	FFS_PINNED_FILE_PATHS_KEY,
	FFS_PINNED_FOLDER_PATHS_KEY,
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
	pinnedFolderPaths: string[];
	focusedFile: TFile | null;
	pinnedFilePaths: string[];
	folderSortRule: FolderSortRule;
	fileSortRule: FileSortRule;
	expandedFolderPaths: string[];

	getData: <T>(key: string) => Promise<T | undefined>;
	saveData: (data: Record<string, unknown>) => Promise<void>;
	restoreData: () => Promise<void>;

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
	_setFocusedFolder: (folder: TFolder | null) => void;
	_createFolder: (path: string) => Promise<TFolder>;
	createNewFolder: (parentFolder: TFolder) => Promise<TFolder | undefined>;
	setFocusedFolder: (folder: TFolder) => Promise<void>;
	sortFolders: (
		folders: TFolder[],
		rule: FolderSortRule,
		includeSubfolderFilesCount: boolean
	) => TFolder[];
	changeFolderSortRule: (rule: FolderSortRule) => Promise<void>;
	restoreFolderSortRule: () => Promise<void>;
	changeExpandedFolderPaths: (folderNames: string[]) => Promise<void>;
	restoreExpandedFolderPaths: () => Promise<void>;
	restoreLastFocusedFolder: () => Promise<void>;
	pinFolder: (folder: TFolder) => Promise<void>;
	unpinFolder: (folder: TFolder) => Promise<void>;
	isFolderPinned: (folder: TFolder) => boolean;
	restorePinnedFolders: () => Promise<void>;

	// Files related
	findFileByPath: (path: string) => TFile | null;
	isFilesInAscendingOrder: () => boolean;
	setFocusedFile: (file: TFile | null) => void;
	openFile: (file: TFile) => void;
	selectFile: (file: TFile) => Promise<void>;
	readFile: (file: TFile) => Promise<string>;
	createFile: (folder: TFolder) => Promise<TFile>;
	duplicateFile: (file: TFile) => Promise<TFile>;
	restoreLastFocusedFile: () => Promise<void>;
	changeFileSortRule: (rule: FileSortRule) => Promise<void>;
	restoreFileSortRule: () => Promise<void>;
	sortFiles: (files: TFile[], rule: FileSortRule) => TFile[];
	pinFile: (file: TFile) => Promise<void>;
	unpinFile: (file: TFile) => Promise<void>;
	isFilePinned: (file: TFile) => boolean;
	restorePinnedFiles: () => Promise<void>;
};

export const createFileTreeStore = (plugin: FolderFileSplitterPlugin) =>
	create((set, get: () => FileTreeStore) => ({
		folders: plugin.app.vault.getAllFolders() || [],
		rootFolder: plugin.app.vault.getRoot() || null,
		focusedFolder: null,
		pinnedFolderPaths: [],
		focusedFile: null,
		pinnedFilePaths: [],
		folderSortRule: DEFAULT_FOLDER_SORT_RULE,
		fileSortRule: DEFAULT_FILE_SORT_RULE,
		expandedFolderPaths: [],

		saveData: async (data: Record<string, unknown>): Promise<void> => {
			const previousData = await plugin.loadData();
			await plugin.saveData({
				...previousData,
				...data,
			});
		},
		getData: async <T>(key: string): Promise<T | undefined> => {
			const data = await plugin.loadData();
			return data[key];
		},
		restoreData: async () => {
			const {
				restoreLastFocusedFolder,
				restoreLastFocusedFile,
				restoreFolderSortRule,
				restoreFileSortRule,
				restoreExpandedFolderPaths,
				restorePinnedFolders,
				restorePinnedFiles
			} = get();
			await Promise.all([
				restoreLastFocusedFolder(),
				restoreLastFocusedFile(),
				restoreFolderSortRule(),
				restoreFileSortRule(),
				restoreExpandedFolderPaths(),
				restorePinnedFolders(),
				restorePinnedFiles(),
			]);
		},

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
		_setFocusedFolder: (folder: TFolder) =>
			set({
				focusedFolder: folder,
			}),
		setFocusedFolder: async (folder: TFolder) => {
			const { _setFocusedFolder, focusedFile, setFocusedFile, saveData } =
				get();
			_setFocusedFolder(folder);

			await saveData({ [FFS_FOCUSED_FOLDER_PATH_KEY]: folder.path });
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
		changeFolderSortRule: async (rule: FolderSortRule) => {
			set({
				folderSortRule: rule,
			});
			await get().saveData({ [FFS_FOLDER_SORT_RULE_KEY]: rule });
		},
		restoreFolderSortRule: async () => {
			const lastFolderSortRule = await get().getData<FolderSortRule>(
				FFS_FOLDER_SORT_RULE_KEY
			);
			if (lastFolderSortRule) {
				set({
					folderSortRule: lastFolderSortRule,
				});
			}
		},
		changeExpandedFolderPaths: async (folderPaths: string[]) => {
			set({
				expandedFolderPaths: folderPaths,
			});
			await get().saveData({
				[FFS_EXPANDED_FOLDER_PATHS_KEY]: JSON.stringify(folderPaths),
			});
		},
		restoreExpandedFolderPaths: async () => {
			const lastExpandedFolderPaths = await get().getData<string>(
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
		restoreLastFocusedFolder: async () => {
			const lastFocusedFolderPath = await get().getData<string>(
				FFS_FOCUSED_FOLDER_PATH_KEY
			);
			const { rootFolder, _setFocusedFolder: _setFocusedFolder } = get();
			if (lastFocusedFolderPath && lastFocusedFolderPath !== "/") {
				const folder = plugin.app.vault.getFolderByPath(
					lastFocusedFolderPath
				);
				if (folder) {
					_setFocusedFolder(folder);
				}
			} else if (rootFolder) {
				_setFocusedFolder(rootFolder);
			}
		},
		isFolderPinned: (folder: TFolder) => {
			const { pinnedFolderPaths } = get();
			return pinnedFolderPaths.includes(folder.path);
		},
		pinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, saveData } = get();
			const folderPaths = [...pinnedFolderPaths, folder.path];
			set({
				pinnedFolderPaths: folderPaths,
			});
			await saveData({
				[FFS_PINNED_FOLDER_PATHS_KEY]: JSON.stringify(folderPaths),
			});
		},
		unpinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, saveData } = get();
			const folderPaths = pinnedFolderPaths.filter(
				(path) => path !== folder.path
			);
			set({
				pinnedFolderPaths: folderPaths,
			});
			await saveData({
				[FFS_PINNED_FOLDER_PATHS_KEY]: JSON.stringify(folderPaths),
			});
		},
		restorePinnedFolders: async () => {
			const { getData } = get();
			const pinnedFolderPaths = await getData<string>(
				FFS_PINNED_FOLDER_PATHS_KEY
			);
			if (pinnedFolderPaths) {
				try {
					const folderPaths: string[] = JSON.parse(pinnedFolderPaths);
					set({
						pinnedFolderPaths: folderPaths,
					});
				} catch (error) {
					console.error("Invalid Json format: ", error);
				}
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
		selectFile: async (file: TFile): Promise<void> => {
			const { setFocusedFile, openFile } = get();
			setFocusedFile(file);
			openFile(file);
			await get().saveData({
				[FFS_FOCUSED_FILE_PATH_KEY]: file.path,
			});
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
		restoreLastFocusedFile: async () => {
			const lastFocusedFilePath = await get().getData<string>(
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
		changeFileSortRule: async (rule: FileSortRule) => {
			set({
				fileSortRule: rule,
			});
			await get().saveData({
				[FFS_FILE_SORT_RULE_KEY]: rule,
			});
		},
		restoreFileSortRule: async () => {
			const lastFileSortRule = await get().getData<FileSortRule>(
				FFS_FILE_SORT_RULE_KEY
			);
			if (lastFileSortRule) {
				set({
					fileSortRule: lastFileSortRule as FileSortRule,
				});
			}
		},
		isFilePinned: (file: TFile) => {
			const { pinnedFilePaths } = get();
			return pinnedFilePaths.includes(file.path);
		},
		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, saveData } = get();
			const filePaths = [...pinnedFilePaths, file.path];
			set({
				pinnedFilePaths: filePaths,
			});
			await saveData({
				[FFS_PINNED_FILE_PATHS_KEY]: JSON.stringify(filePaths),
			});
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, saveData } = get();
			const filePaths = pinnedFilePaths.filter(
				(path) => path !== file.path
			);
			set({
				pinnedFilePaths: filePaths,
			});
			await saveData({
				[FFS_PINNED_FILE_PATHS_KEY]: JSON.stringify(filePaths),
			});
		},
		restorePinnedFiles: async () => {
			const { getData } = get();
			const pinnedFilePaths = await getData<string>(
				FFS_PINNED_FILE_PATHS_KEY
			);
			if (pinnedFilePaths) {
				try {
					const filePaths: string[] = JSON.parse(pinnedFilePaths);
					set({
						pinnedFilePaths: filePaths,
					});
				} catch (error) {
					console.error("Invalid Json format: ", error);
				}
			}
		},
	}));
