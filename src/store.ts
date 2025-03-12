import { create } from "zustand";
import { TFile, TFolder } from "obsidian";

import FolderFileSplitterPlugin from "./main";
import { isFile, isFolder } from "./utils";
import {
	FFS_EXPANDED_FOLDER_PATHS_KEY,
	FFS_FILE_MANUAL_SORT_ORDER_KEY,
	FFS_FILE_SORT_RULE_KEY,
	FFS_FOCUSED_FILE_PATH_KEY,
	FFS_FOCUSED_FOLDER_PATH_KEY,
	FFS_FOLDER_MANUAL_SORT_ORDER_KEY,
	FFS_FOLDER_SORT_RULE_KEY,
	FFS_PINNED_FILE_PATHS_KEY,
	FFS_PINNED_FOLDER_PATHS_KEY,
} from "./assets/constants";

export type FolderSortRule =
	| "FolderNameAscending"
	| "FolderNameDescending"
	| "FilesCountAscending"
	| "FilesCountDescending"
	| "FolderManualOrder";
export const DEFAULT_FOLDER_SORT_RULE: FolderSortRule = "FolderNameAscending";
export type FileSortRule =
	| "FileNameAscending"
	| "FileNameDescending"
	| "FileCreatedTimeAscending"
	| "FileCreatedTimeDescending"
	| "FileModifiedTimeAscending"
	| "FileModifiedTimeDescending"
	| "FileManualOrder";
const DEFAULT_FILE_SORT_RULE: FileSortRule = "FileNameAscending";
export const FILE_MANUAL_SORT_RULE: FileSortRule = "FileManualOrder";
export const FOLDER_MANUAL_SORT_RULE: FolderSortRule = "FolderManualOrder";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;

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
	filesManualSortOrder: ManualSortOrder;
	foldersManualSortOrder: ManualSortOrder;

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
	initFoldersManualSortOrder: () => Promise<void>;
	restoreFoldersManualSortOrder: () => Promise<void>;
	changeFoldersManualOrder: (
		folder: TFolder,
		atIndex: number
	) => ManualSortOrder | undefined;
	changeFoldersManualOrderAndSave: (
		folder: TFolder,
		atIndex: number
	) => Promise<void>;
	_updateAndSaveFoldersOrder: (
		updatedOrder: ManualSortOrder
	) => Promise<void>;
	_removeFolderPathFromOrder: (folder: TFolder) => Promise<void>;
	trashFolder: (folder: TFolder) => Promise<void>;

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
	initFilesManualSortOrder: () => Promise<void>;
	restoreFilesManualSortOrder: () => Promise<void>;
	changeFilesManualOrder: (
		file: TFile,
		atIndex: number
	) => ManualSortOrder | undefined;
	changeFilesManualOrderAndSave: (
		file: TFile,
		atIndex: number
	) => Promise<void>;
	_updateAndSaveFilesOrder: (updatedOrder: ManualSortOrder) => Promise<void>;
	_removeFilePathFromOrder: (file: TFile) => Promise<void>;
	trashFile: (file: TFile) => Promise<void>;
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
		filesManualSortOrder: {},
		foldersManualSortOrder: {},

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
				restorePinnedFiles,
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
			const files = folder.children ?? [];
			return files.filter((child) => isFile(child));
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
				await get().saveData({
					[FFS_FOCUSED_FILE_PATH_KEY]: null,
				});
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
			includeSubfolder: boolean
		): TFolder[] => {
			const {
				getFilesCountInFolder: getFilesCount,
				foldersManualSortOrder: order,
			} = get();
			const parentPath = folders[0]?.parent?.path;
			const folderPaths = parentPath ? order[parentPath] : [];
			switch (rule) {
				case "FolderNameAscending":
					return folders.sort((a, b) => a.name.localeCompare(b.name));
				case "FolderNameDescending":
					return folders.sort((a, b) => b.name.localeCompare(a.name));
				case "FilesCountAscending":
					return folders.sort(
						(a, b) =>
							getFilesCount(a, includeSubfolder) -
							getFilesCount(b, includeSubfolder)
					);
				case "FilesCountDescending":
					return folders.sort(
						(a, b) =>
							getFilesCount(b, includeSubfolder) -
							getFilesCount(a, includeSubfolder)
					);
				case "FolderManualOrder":
					if (!parentPath || !folderPaths || !folderPaths.length)
						return folders;
					return folderPaths
						.map((path) => folders.find((f) => f.path === path))
						.concat(
							folders.filter((f) => !folderPaths.includes(f.path))
						)
						.filter(Boolean) as TFolder[];
				default:
					return folders;
			}
		},
		changeFolderSortRule: async (rule: FolderSortRule) => {
			set({
				folderSortRule: rule,
			});
			await get().saveData({ [FFS_FOLDER_SORT_RULE_KEY]: rule });
		},
		restoreFolderSortRule: async () => {
			const { restoreFoldersManualSortOrder, getData } = get();
			const lastFolderSortRule = await getData<FolderSortRule>(
				FFS_FOLDER_SORT_RULE_KEY
			);
			if (lastFolderSortRule) {
				set({
					folderSortRule: lastFolderSortRule,
				});
				if (lastFolderSortRule === FOLDER_MANUAL_SORT_RULE) {
					await restoreFoldersManualSortOrder();
				}
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
		initFoldersManualSortOrder: async () => {
			const {
				folderSortRule,
				folders,
				getFoldersByParent,
				rootFolder,
				sortFolders,
				saveData,
			} = get();
			const foldersToInit = [rootFolder, ...folders].filter(Boolean);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				if (folder) {
					const folders = getFoldersByParent(folder);
					if (folders.length) {
						const sortedFolders = sortFolders(
							folders,
							folderSortRule,
							plugin.settings.includeSubfolderFilesCount
						);
						order[folder.path] = sortedFolders.map(
							(folder) => folder.path
						);
					}
				}
			});
			set({
				foldersManualSortOrder: order,
			});
			await saveData({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: order,
			});
		},
		restoreFoldersManualSortOrder: async () => {
			const { getData } = get();
			const order = await getData<ManualSortOrder>(
				FFS_FOLDER_MANUAL_SORT_ORDER_KEY
			);
			if (order) {
				set({
					foldersManualSortOrder: order,
				});
			}
		},
		changeFoldersManualOrder: (folder: TFolder, atIndex: number) => {
			const { foldersManualSortOrder } = get();
			const parentPath = folder.parent?.path;
			if (!parentPath) return;

			const initialOrder = foldersManualSortOrder[parentPath] ?? [];
			const currentIndex = initialOrder.indexOf(folder.path);
			if (currentIndex === atIndex) {
				return foldersManualSortOrder;
			}
			const newOrder = [...initialOrder];
			newOrder.splice(currentIndex, 1);
			newOrder.splice(atIndex, 0, folder.path);
			const updatedOrder = {
				...foldersManualSortOrder,
				[parentPath]: newOrder,
			};
			set({
				foldersManualSortOrder: updatedOrder,
			});
			return updatedOrder;
		},
		changeFoldersManualOrderAndSave: async (
			folder: TFolder,
			atIndex: number
		) => {
			const { saveData, changeFoldersManualOrder } = get();
			const updatedOrder = changeFoldersManualOrder(folder, atIndex);
			await saveData({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateAndSaveFoldersOrder: async (updatedOrder: ManualSortOrder) => {
			const { saveData } = get();
			set({
				foldersManualSortOrder: updatedOrder,
			});

			await saveData({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_removeFolderPathFromOrder: async (folder: TFolder) => {
			const {
				folderSortRule,
				foldersManualSortOrder: order,
				_updateAndSaveFilesOrder,
			} = get();
			if (folderSortRule !== FOLDER_MANUAL_SORT_RULE) return;
			const parentPath = folder.parent?.path;
			if (!parentPath) return;
			let paths = order[parentPath] ?? [];
			paths = paths.filter((p) => p !== folder.path);
			const updatedOrder = {
				...order,
				[parentPath]: paths,
			};
			await _updateAndSaveFilesOrder(updatedOrder);
		},
		trashFolder: async (folder: TFolder) => {
			const { _removeFolderPathFromOrder, isFolderPinned, unpinFolder } =
				get();
			const { app } = plugin;
			if (isFolderPinned(folder)) {
				await unpinFolder(folder);
			}
			await app.fileManager.trashFile(folder);
			await _removeFolderPathFromOrder(folder);
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
				newFileName = `${defaultFileName} ${untitledFilesCount + 1}`;
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
			const { filesManualSortOrder } = get();
			const parentPath = files[0].parent?.path;
			const filePaths = parentPath
				? filesManualSortOrder[parentPath]
				: [];
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
				case "FileManualOrder":
					if (!parentPath || !filePaths || !filePaths.length)
						return files;
					return filePaths
						.map((path) => files.find((f) => f.path === path))
						.concat(
							files.filter((f) => !filePaths.includes(f.path))
						)
						.filter(Boolean) as TFile[];
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
			const { getData, restoreFilesManualSortOrder } = get();
			const lastFileSortRule = await getData<FileSortRule>(
				FFS_FILE_SORT_RULE_KEY
			);
			if (lastFileSortRule) {
				set({
					fileSortRule: lastFileSortRule as FileSortRule,
				});
			}
			if (lastFileSortRule === FILE_MANUAL_SORT_RULE) {
				await restoreFilesManualSortOrder();
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
		initFilesManualSortOrder: async () => {
			const {
				fileSortRule,
				folders,
				rootFolder,
				sortFiles,
				getDirectFilesInFolder,
				saveData,
			} = get();
			const foldersToInit = [rootFolder, ...folders].filter(Boolean);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				if (folder) {
					const files = getDirectFilesInFolder(folder);
					if (files.length) {
						const sortedFiles = sortFiles(files, fileSortRule);
						order[folder.path] = sortedFiles.map(
							(file) => file.path
						);
					}
				}
			});
			set({
				filesManualSortOrder: order,
			});
			await saveData({
				[FFS_FILE_MANUAL_SORT_ORDER_KEY]: order,
			});
		},
		restoreFilesManualSortOrder: async () => {
			const { getData } = get();
			const order = await getData<ManualSortOrder>(
				FFS_FILE_MANUAL_SORT_ORDER_KEY
			);
			if (order) {
				set({
					filesManualSortOrder: order,
				});
			}
		},
		changeFilesManualOrder: (file: TFile, atIndex: number) => {
			const { filesManualSortOrder } = get();
			const parentPath = file.parent?.path;
			if (!parentPath) return;

			const initialOrder = filesManualSortOrder[parentPath] ?? [];
			const currentIndex = initialOrder.indexOf(file.path);
			if (currentIndex === atIndex) {
				return filesManualSortOrder;
			}
			const newOrder = [...initialOrder];
			newOrder.splice(currentIndex, 1);
			newOrder.splice(atIndex, 0, file.path);
			const updatedOrder = {
				...filesManualSortOrder,
				[parentPath]: newOrder,
			};
			set({
				filesManualSortOrder: updatedOrder,
				fileSortRule: FILE_MANUAL_SORT_RULE,
			});
			return updatedOrder;
		},
		changeFilesManualOrderAndSave: async (file: TFile, atIndex: number) => {
			const { saveData, changeFilesManualOrder } = get();
			const updatedOrder = changeFilesManualOrder(file, atIndex);
			await saveData({
				[FFS_FILE_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateAndSaveFilesOrder: async (updatedOrder: ManualSortOrder) => {
			const { saveData } = get();
			set({
				filesManualSortOrder: updatedOrder,
			});
			await saveData({
				[FFS_FILE_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_removeFilePathFromOrder: async (file: TFile) => {
			const {
				fileSortRule,
				filesManualSortOrder: order,
				_updateAndSaveFilesOrder,
			} = get();
			if (fileSortRule === FILE_MANUAL_SORT_RULE) {
				const parentPath = file.parent?.path;
				if (!parentPath) return;
				let paths = order[parentPath] ?? [];
				paths = paths.filter((p) => p !== file.path);
				const updatedOrder = {
					...order,
					[parentPath]: paths,
				};
				await _updateAndSaveFilesOrder(updatedOrder);
			}
		},
		trashFile: async (file: TFile) => {
			const { _removeFilePathFromOrder, isFilePinned, unpinFile } = get();
			const { app } = plugin;
			if (isFilePinned(file)) {
				await unpinFile(file);
			}
			await app.fileManager.trashFile(file);
			await _removeFilePathFromOrder(file);
		},
	}));
