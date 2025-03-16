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

	getDataFromLocalStorage: (key: string) => string | null;
	saveDataInLocalStorage: (key: string, value: string) => void;
	removeDataFromLocalStorage: (key: string) => void;
	getDataFromPlugin: <T>(key: string) => Promise<T | undefined>;
	saveDataInPlugin: (data: Record<string, unknown>) => Promise<void>;
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
	setFocusedFolder: (folder: TFolder | null) => Promise<void>;
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
	_updatePinnedFolderPaths: (paths: string[]) => Promise<void>;
	pinFolder: (folder: TFolder) => Promise<void>;
	unpinFolder: (folder: TFolder) => Promise<void>;
	isFolderPinned: (folder: TFolder) => boolean;
	restorePinnedFolders: () => Promise<void>;
	initFoldersManualSortOrder: () => Promise<void>;
	getInitialFoldersOrder: () => ManualSortOrder;
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
	_updatePinnedFolderPath: (
		oldPath: string,
		newPath: string
	) => Promise<void>;
	_updateFolderManualOrder: (
		parentPath: string,
		oldPath: string,
		newPath: string
	) => Promise<void>;
	renameFolder: (folder: TFolder, newName: string) => Promise<void>;

	// Files related
	findFileByPath: (path: string) => TFile | null;
	isFilesInAscendingOrder: () => boolean;
	setFocusedFile: (file: TFile | null) => Promise<void>;
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
	_updatePinnedFilePath: (oldPath: string, newPath: string) => Promise<void>;
	_updatePinnedFilePaths: (paths: string[]) => Promise<void>;
	isFilePinned: (file: TFile) => boolean;
	restorePinnedFiles: () => Promise<void>;
	initFilesManualSortOrder: () => Promise<void>;
	getInitialFilesOrder: () => ManualSortOrder;
	restoreFilesManualSortOrder: () => Promise<void>;
	_updateFileManualOrder: (
		parentPath: string,
		oldPath: string,
		newPath: string
	) => Promise<void>;
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
	renameFile: (file: TFile, newName: string) => Promise<void>;
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

		saveDataInLocalStorage: (key: string, value: string) => {
			localStorage.setItem(key, value);
		},
		getDataFromLocalStorage: (key: string) => {
			return localStorage.getItem(key);
		},
		removeDataFromLocalStorage: (key: string) => {
			localStorage.removeItem(key);
		},
		saveDataInPlugin: async (
			data: Record<string, unknown>
		): Promise<void> => {
			const previousData = await plugin.loadData();
			await plugin.saveData({
				...previousData,
				...data,
			});
		},
		getDataFromPlugin: async <T>(key: string): Promise<T | undefined> => {
			try {
				const data = await plugin.loadData();
				return data[key];
			} catch (e) {
				console.error(e);
				return undefined;
			}
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
		_setFocusedFolder: (folder: TFolder | null) =>
			set({
				focusedFolder: folder,
			}),
		setFocusedFolder: async (folder: TFolder | null) => {
			const {
				_setFocusedFolder,
				focusedFile,
				setFocusedFile,
				saveDataInLocalStorage,
				removeDataFromLocalStorage,
			} = get();
			_setFocusedFolder(folder);

			if (folder) {
				saveDataInLocalStorage(
					FFS_FOCUSED_FOLDER_PATH_KEY,
					folder.path
				);
			} else {
				removeDataFromLocalStorage(FFS_FOCUSED_FOLDER_PATH_KEY);
			}
			if (focusedFile?.parent?.path !== folder?.path) {
				await setFocusedFile(null);
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
			await get().saveDataInPlugin({ [FFS_FOLDER_SORT_RULE_KEY]: rule });
		},
		restoreFolderSortRule: async () => {
			const { restoreFoldersManualSortOrder, getDataFromPlugin } = get();
			const lastFolderSortRule = await getDataFromPlugin<FolderSortRule>(
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
			const { saveDataInLocalStorage } = get();
			set({
				expandedFolderPaths: folderPaths,
			});
			saveDataInLocalStorage(
				FFS_EXPANDED_FOLDER_PATHS_KEY,
				JSON.stringify(folderPaths)
			);
		},
		restoreExpandedFolderPaths: async () => {
			const { getDataFromLocalStorage } = get();
			const lastExpandedFolderPaths = getDataFromLocalStorage(
				FFS_EXPANDED_FOLDER_PATHS_KEY
			);
			if (!lastExpandedFolderPaths) return;
			try {
				const folderPaths = JSON.parse(lastExpandedFolderPaths);
				set({
					expandedFolderPaths: folderPaths,
				});
			} catch (error) {
				console.error("Invalid Json format: ", error);
			}
		},
		restoreLastFocusedFolder: async () => {
			const { getDataFromLocalStorage } = get();
			const lastFocusedFolderPath = getDataFromLocalStorage(
				FFS_FOCUSED_FOLDER_PATH_KEY
			);
			const { rootFolder, _setFocusedFolder: _setFocusedFolder } = get();
			if (!lastFocusedFolderPath) return;
			if (lastFocusedFolderPath !== "/") {
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
		_updatePinnedFolderPaths: async (folderPaths: string[]) => {
			const { saveDataInPlugin } = get();
			set({
				pinnedFolderPaths: folderPaths,
			});
			await saveDataInPlugin({
				[FFS_PINNED_FOLDER_PATHS_KEY]: JSON.stringify(folderPaths),
			});
		},
		pinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			const folderPaths = [...pinnedFolderPaths, folder.path];
			await _updatePinnedFolderPaths(folderPaths);
		},
		unpinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			const folderPaths = pinnedFolderPaths.filter(
				(path) => path !== folder.path
			);
			await _updatePinnedFolderPaths(folderPaths);
		},
		restorePinnedFolders: async () => {
			const { getDataFromPlugin: getData } = get();
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
		getInitialFoldersOrder: () => {
			const {
				folderSortRule,
				folders,
				getFoldersByParent,
				rootFolder,
				sortFolders,
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
			return order;
		},
		initFoldersManualSortOrder: async () => {
			const {
				folderSortRule,
				folders,
				getFoldersByParent,
				rootFolder,
				sortFolders,
				saveDataInPlugin,
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
			await saveDataInPlugin({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: order,
			});
		},
		restoreFoldersManualSortOrder: async () => {
			const { getDataFromPlugin, getInitialFoldersOrder } = get();
			const initialOrder = getInitialFoldersOrder();
			const previousRrder =
				(await getDataFromPlugin<ManualSortOrder>(
					FFS_FOLDER_MANUAL_SORT_ORDER_KEY
				)) ?? {};
			set({
				foldersManualSortOrder: {
					...initialOrder,
					...previousRrder,
				},
			});
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
			const { saveDataInPlugin, changeFoldersManualOrder } = get();
			const updatedOrder = changeFoldersManualOrder(folder, atIndex);
			await saveDataInPlugin({
				[FFS_FOLDER_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateAndSaveFoldersOrder: async (updatedOrder: ManualSortOrder) => {
			const { saveDataInPlugin } = get();
			set({
				foldersManualSortOrder: updatedOrder,
			});

			await saveDataInPlugin({
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
			const {
				_removeFolderPathFromOrder,
				isFolderPinned,
				unpinFolder,
				focusedFolder,
				setFocusedFolder,
			} = get();
			const { app } = plugin;
			if (isFolderPinned(folder)) {
				await unpinFolder(folder);
			}
			if (folder.path === focusedFolder?.path) {
				setFocusedFolder(null);
			}
			await app.fileManager.trashFile(folder);
			await _removeFolderPathFromOrder(folder);
		},
		_updatePinnedFolderPath: async (oldPath: string, newPath: string) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			if (!pinnedFolderPaths.includes(oldPath)) return;

			const pinnedIndex = pinnedFolderPaths.indexOf(oldPath);
			const paths = [...pinnedFolderPaths];
			paths.splice(pinnedIndex, 1, newPath);
			await _updatePinnedFolderPaths(paths);
		},
		_updateFolderManualOrder: async (
			parentPath: string,
			oldPath: string,
			newPath: string
		) => {
			const {
				foldersManualSortOrder: order,
				_updateAndSaveFoldersOrder,
			} = get();
			const orderedPaths = [...(order[parentPath] ?? [])];
			if (!orderedPaths.length) return;
			const index = orderedPaths.indexOf(oldPath);
			if (index >= 0) {
				orderedPaths[index] = newPath;
			} else {
				orderedPaths.push(newPath);
			}
			_updateAndSaveFoldersOrder({
				...order,
				[parentPath]: orderedPaths,
			});
		},
		renameFolder: async (folder: TFolder, newName: string) => {
			const {
				isFolderPinned,
				_updatePinnedFolderPath,
				_updateFolderManualOrder,
			} = get();
			const oldPath = folder.path;
			const parentPath = folder.parent?.path;
			const newPath = folder.path.replace(folder.name, newName);
			try {
				const isPinned = isFolderPinned(folder);
				await plugin.app.vault.rename(folder, newPath);
				if (isPinned) {
					await _updatePinnedFolderPath(oldPath, newPath);
				}
				if (!parentPath) return;
				await _updateFolderManualOrder(parentPath, oldPath, newPath);
			} catch (e) {
				console.log(e);
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
		setFocusedFile: async (file: TFile | null) => {
			const { saveDataInLocalStorage, removeDataFromLocalStorage } =
				get();
			set({
				focusedFile: file,
			});
			if (file) {
				saveDataInLocalStorage(FFS_FOCUSED_FILE_PATH_KEY, file.path);
			} else {
				removeDataFromLocalStorage(FFS_FOCUSED_FILE_PATH_KEY);
			}
		},
		openFile: (file: TFile): void => {
			const leaf = plugin.app.workspace.getLeaf();
			plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
			leaf.openFile(file, { eState: { focus: true } });
		},
		selectFile: async (file: TFile): Promise<void> => {
			const { setFocusedFile, openFile } = get();
			await setFocusedFile(file);
			openFile(file);
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
			const { findFileByPath, selectFile, getDataFromLocalStorage } =
				get();
			const lastFocusedFilePath = getDataFromLocalStorage(
				FFS_FOCUSED_FILE_PATH_KEY
			);
			if (!lastFocusedFilePath) return;
			const file = findFileByPath(lastFocusedFilePath);
			if (file) {
				selectFile(file);
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
			await get().saveDataInPlugin({
				[FFS_FILE_SORT_RULE_KEY]: rule,
			});
		},
		restoreFileSortRule: async () => {
			const { getDataFromPlugin: getData, restoreFilesManualSortOrder } =
				get();
			const lastFileSortRule = await getData<FileSortRule>(
				FFS_FILE_SORT_RULE_KEY
			);
			if (!lastFileSortRule) return;
			set({
				fileSortRule: lastFileSortRule as FileSortRule,
			});
			if (lastFileSortRule === FILE_MANUAL_SORT_RULE) {
				await restoreFilesManualSortOrder();
			}
		},
		isFilePinned: (file: TFile) => {
			const { pinnedFilePaths } = get();
			return pinnedFilePaths.includes(file.path);
		},
		_updatePinnedFilePaths: async (filePaths: string[]) => {
			const { saveDataInPlugin } = get();
			set({
				pinnedFilePaths: filePaths,
			});
			await saveDataInPlugin({
				[FFS_PINNED_FILE_PATHS_KEY]: JSON.stringify(filePaths),
			});
		},
		pinFile: async (file: TFile) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			const filePaths = [...pinnedFilePaths, file.path];
			await _updatePinnedFilePaths(filePaths);
		},
		unpinFile: async (file: TFile) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			const filePaths = pinnedFilePaths.filter(
				(path) => path !== file.path
			);
			await _updatePinnedFilePaths(filePaths);
		},
		restorePinnedFiles: async () => {
			const { getDataFromPlugin: getData } = get();
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
		getInitialFilesOrder: () => {
			const {
				fileSortRule,
				folders,
				rootFolder,
				sortFiles,
				getDirectFilesInFolder,
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
			return order;
		},
		initFilesManualSortOrder: async () => {
			const {
				fileSortRule,
				folders,
				rootFolder,
				sortFiles,
				getDirectFilesInFolder,
				saveDataInPlugin,
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
			await saveDataInPlugin({
				[FFS_FILE_MANUAL_SORT_ORDER_KEY]: order,
			});
		},
		restoreFilesManualSortOrder: async () => {
			const { getDataFromPlugin, getInitialFilesOrder } = get();
			const initialOrder = getInitialFilesOrder();
			const previousOrder =
				(await getDataFromPlugin<ManualSortOrder>(
					FFS_FILE_MANUAL_SORT_ORDER_KEY
				)) ?? {};
			set({
				filesManualSortOrder: {
					...initialOrder,
					...previousOrder,
				},
			});
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
			const { saveDataInPlugin, changeFilesManualOrder } = get();
			const updatedOrder = changeFilesManualOrder(file, atIndex);
			await saveDataInPlugin({
				[FFS_FILE_MANUAL_SORT_ORDER_KEY]: updatedOrder,
			});
		},
		_updateAndSaveFilesOrder: async (updatedOrder: ManualSortOrder) => {
			const { saveDataInPlugin } = get();
			set({
				filesManualSortOrder: updatedOrder,
			});
			await saveDataInPlugin({
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
			const {
				_removeFilePathFromOrder,
				isFilePinned,
				unpinFile,
				setFocusedFile,
				focusedFile,
			} = get();
			const { app } = plugin;
			if (isFilePinned(file)) {
				await unpinFile(file);
			}
			if (file.path === focusedFile?.path) {
				await setFocusedFile(null);
			}
			await app.fileManager.trashFile(file);
			await _removeFilePathFromOrder(file);
		},
		_updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;

			const pinnedIndex = pinnedFilePaths.indexOf(oldPath);
			const paths = [...pinnedFilePaths];
			paths.splice(pinnedIndex, 1, newPath);
			await _updatePinnedFilePaths(paths);
		},
		_updateFileManualOrder: async (
			parentPath: string,
			oldPath: string,
			newPath: string
		) => {
			const { filesManualSortOrder: order, _updateAndSaveFilesOrder } =
				get();
			const orderedPaths = [...(order[parentPath] ?? [])];
			if (!orderedPaths.length) return;
			const index = orderedPaths.indexOf(oldPath);
			if (index >= 0) {
				orderedPaths[index] = newPath;
			} else {
				orderedPaths.push(newPath);
			}
			_updateAndSaveFilesOrder({
				...order,
				[parentPath]: orderedPaths,
			});
		},
		renameFile: async (file: TFile, newName: string) => {
			const {
				isFilePinned,
				_updatePinnedFilePath,
				_updateFileManualOrder,
			} = get();
			const oldPath = file.path;
			const parentPath = file.parent?.path;
			const newPath = file.path.replace(file.basename, newName);
			try {
				const isPinned = isFilePinned(file);
				await plugin.app.vault.rename(file, newPath);
				if (isPinned) {
					await _updatePinnedFilePath(oldPath, newPath);
				}
				if (!parentPath) return;
				await _updateFileManualOrder(parentPath, oldPath, newPath);
			} catch (e) {
				console.log(e);
			}
		},
	}));
