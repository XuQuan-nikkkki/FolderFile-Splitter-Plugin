import { StateCreator } from "zustand";
import { Notice, TFile, TFolder } from "obsidian";

import FolderFileSplitterPlugin from "../main";
import { isFile, isFolder, uniq } from "../utils";
import {
	FFS_EXPANDED_FOLDER_PATHS_KEY,
	FFS_FOCUSED_FOLDER_PATH_KEY,
	FFS_FOLDER_MANUAL_SORT_ORDER_KEY,
	FFS_FOLDER_SORT_RULE_KEY,
	FFS_PINNED_FOLDER_PATHS_KEY,
} from "../assets/constants";
import {
	FOLDER_NOTE_LOCATION,
	FOLDER_NOTE_MISSING_BEHAVIOR,
} from "../settings";
import { NOTIFICATION_MESSAGE_COPY } from "../locales/message";
import { ExplorerStore } from "src/store";

export type FolderSortRule =
	| "FolderNameAscending"
	| "FolderNameDescending"
	| "FilesCountAscending"
	| "FilesCountDescending"
	| "FolderManualOrder";
export const DEFAULT_FOLDER_SORT_RULE: FolderSortRule = "FolderNameAscending";
export const FOLDER_MANUAL_SORT_RULE: FolderSortRule = "FolderManualOrder";

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;

export type FolderExplorerStore = {
	folders: TFolder[];
	rootFolder: TFolder | null;
	focusedFolder: TFolder | null;
	pinnedFolderPaths: string[];
	folderSortRule: FolderSortRule;
	expandedFolderPaths: string[];
	foldersManualSortOrder: ManualSortOrder;
	latestCreatedFolder: TFolder | null;
	latestFolderCreatedTime: number | null;

	getTopLevelFolders: () => TFolder[];
	getFilesCountInFolder: (
		folder: TFolder,
		includeSubfolderFiles: boolean
	) => number;
	getFoldersByParent: (parentFolder: TFolder) => TFolder[];
	getFilesInFolder: (folder: TFolder, getFilesInFolder?: boolean) => TFile[];
	hasFolderChildren: (folder: TFolder) => boolean;
	isFoldersInAscendingOrder: () => boolean;
	_setFocusedFolder: (folder: TFolder | null) => void;
	_createFolder: (path: string) => Promise<TFolder>;
	createNewFolder: (parentFolder: TFolder) => Promise<TFolder | undefined>;
	setFocusedFolder: (folder: TFolder | null) => Promise<void>;
	sortFolders: (
		folders: TFolder[],
		rule: FolderSortRule,
		includeSubfolderFiles: boolean
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
	moveFolder: (folder: TFolder, newPath: string) => Promise<void>;
	renameFolder: (folder: TFolder, newName: string) => Promise<void>;
	expandFolder: (folder: TFolder) => void;
	collapseFolder: (folder: TFolder) => void;
	updateFolderPinState: (oldPath: string, newPath: string) => Promise<void>;
	getNameOfFolder: (folder: TFolder) => string;
};

export const createFolderExplorerStore =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FolderExplorerStore> =>
	(set, get) => ({
		folders: plugin.app.vault.getAllFolders() || [],
		rootFolder: plugin.app.vault.getRoot() || null,
		focusedFolder: null,
		pinnedFolderPaths: [],
		folderSortRule: DEFAULT_FOLDER_SORT_RULE,
		expandedFolderPaths: [],
		foldersManualSortOrder: {},
		latestCreatedFolder: null,
		latestFolderCreatedTime: null,

		getTopLevelFolders: () => {
			return plugin.app.vault
				.getAllFolders()
				.filter((folder) => folder.parent?.parent === null);
		},
		hasFolderChildren: (folder: TFolder): boolean => {
			return folder.children.some((child) => isFolder(child));
		},
		getFilesCountInFolder: (
			folder: TFolder,
			includeSubfolderFiles: boolean
		): number => {
			const getFilesCount = (folder: TFolder): number => {
				if (!folder || !folder.children) return 0;
				return folder.children.reduce((total, child) => {
					if (isFile(child)) {
						return total + 1;
					}
					if (includeSubfolderFiles && isFolder(child)) {
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
		getFilesInFolder: (
			folder: TFolder,
			includeSubfolder = false
		): TFile[] => {
			const getFiles = (folder: TFolder): TFile[] => {
				if (!folder || !folder.children) return [];

				return folder.children.reduce<TFile[]>((files, child) => {
					if (isFile(child)) {
						files.push(child as TFile);
					} else if (includeSubfolder && isFolder(child)) {
						files.push(...getFiles(child as TFolder));
					}
					return files;
				}, []);
			};

			return getFiles(folder);
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
				selectFile,
				setFocusedTag,
			} = get();
			_setFocusedFolder(folder);

			if (!folder) {
				removeDataFromLocalStorage(FFS_FOCUSED_FOLDER_PATH_KEY);
			} else {
				setFocusedTag(null);
				saveDataInLocalStorage(
					FFS_FOCUSED_FOLDER_PATH_KEY,
					folder.path
				);

				const { settings, language } = plugin;
				const {
					autoOpenFolderNote,
					folderNoteLocation,
					customFolderNotePath,
					folderNoteMissingBehavior,
				} = settings;
				const { IGNORE, WARN, CREATE } = FOLDER_NOTE_MISSING_BEHAVIOR;
				if (autoOpenFolderNote) {
					let folderNotePath = "";
					if (
						[
							FOLDER_NOTE_LOCATION.INDEX_FILE,
							FOLDER_NOTE_LOCATION.UNDERSCORE_FILE,
						].includes(folderNoteLocation)
					) {
						folderNotePath = `${folder?.path}/${folderNoteLocation}`;
					} else if (
						folderNoteLocation ===
						FOLDER_NOTE_LOCATION.FOLDER_NAME_FILE
					) {
						folderNotePath = `${folder?.path}/${folder?.name}.md`;
					} else {
						folderNotePath = customFolderNotePath.replace(
							"{folder}",
							folder?.name || ""
						);
					}
					const file = plugin.app.vault.getFileByPath(folderNotePath);
					if (file) {
						await selectFile(file);
					} else {
						if (folderNoteMissingBehavior === IGNORE) return;
						if (folderNoteMissingBehavior === WARN) {
							new Notice(
								`${NOTIFICATION_MESSAGE_COPY.folderNoteMissing[language]}'${folderNotePath}'`
							);
						} else if (folderNoteMissingBehavior === CREATE) {
							const newFile = await plugin.app.vault.create(
								folderNotePath,
								""
							);
							await selectFile(newFile);
						}
					}
				} else if (focusedFile?.parent?.path !== folder?.path) {
					await setFocusedFile(null);
				}
			}
		},
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
			if (!lastFolderSortRule) return;
			set({
				folderSortRule: lastFolderSortRule,
			});
			if (lastFolderSortRule === FOLDER_MANUAL_SORT_RULE) {
				await restoreFoldersManualSortOrder();
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
			const { getDataFromLocalStorage, hasFolderChildren } = get();
			const lastExpandedFolderPaths = getDataFromLocalStorage(
				FFS_EXPANDED_FOLDER_PATHS_KEY
			);
			if (!lastExpandedFolderPaths) return;
			try {
				const folderPaths: string[] = JSON.parse(
					lastExpandedFolderPaths
				);
				set({
					expandedFolderPaths: folderPaths.filter((path) => {
						const folder = plugin.app.vault.getFolderByPath(path);
						return folder && hasFolderChildren(folder);
					}),
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
			if (pinnedFolderPaths.includes(folder.path)) return;
			const folderPaths = [...pinnedFolderPaths, folder.path];
			await _updatePinnedFolderPaths(folderPaths);
		},
		unpinFolder: async (folder: TFolder) => {
			const { pinnedFolderPaths, _updatePinnedFolderPaths } = get();
			if (!pinnedFolderPaths.includes(folder.path)) return;
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
			const { folderSortRule, getFoldersByParent, sortFolders } = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				if (folder) {
					const folders = getFoldersByParent(folder);
					if (folders.length) {
						const sortedFolders = sortFolders(
							folders,
							folderSortRule,
							plugin.settings.includeSubfolderFiles
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
				getFoldersByParent,
				sortFolders,
				saveDataInPlugin,
			} = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				const folders = getFoldersByParent(folder);
				if (folders.length) {
					const sortedFolders = sortFolders(
						folders,
						folderSortRule,
						plugin.settings.includeSubfolderFiles
					);
					order[folder.path] = sortedFolders.map(
						(folder) => folder.path
					);
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
			const {
				getDataFromPlugin,
				getInitialFoldersOrder,
				_updateAndSaveFoldersOrder,
			} = get();
			const { vault } = plugin.app;
			const order = getInitialFoldersOrder();
			const previousOrder =
				(await getDataFromPlugin<ManualSortOrder>(
					FFS_FOLDER_MANUAL_SORT_ORDER_KEY
				)) ?? {};
			Object.keys(previousOrder).forEach((parentFolderPath) => {
				if (!vault.getFolderByPath(parentFolderPath)) return;
				const paths = previousOrder[parentFolderPath].filter((p) =>
					Boolean(vault.getFolderByPath(p))
				);
				if (paths.length > 0) {
					order[parentFolderPath] = paths;
				}
			});
			await _updateAndSaveFoldersOrder(order);
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
		trashFolder: async (folder: TFolder) => {
			const { focusedFolder, setFocusedFolder } = get();
			const { app } = plugin;
			const focusedFolderPaths = focusedFolder?.path.split("/") ?? [];
			if (focusedFolderPaths.includes(folder.path)) {
				setFocusedFolder(null);
			}
			await app.fileManager.trashFile(folder);
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
			const updatedOrder = { ...order };
			const index = orderedPaths.indexOf(oldPath);
			if (index >= 0) {
				orderedPaths[index] = newPath;
			} else {
				orderedPaths.push(newPath);
			}
			updatedOrder[parentPath] = orderedPaths;
			const childPaths = updatedOrder[oldPath];
			if (childPaths) {
				delete updatedOrder[oldPath];
				updatedOrder[newPath] = childPaths;
			}
			_updateAndSaveFoldersOrder(updatedOrder);
		},
		updateFolderPinState: async (oldPath: string, newPath: string) => {
			const { pinnedFolderPaths, _updatePinnedFolderPath } = get();
			if (!pinnedFolderPaths.includes(oldPath)) return;
			await _updatePinnedFolderPath(oldPath, newPath);
		},
		moveFolder: async (folder: TFolder, newPath: string) => {
			await plugin.app.vault.rename(folder, newPath);
		},
		renameFolder: async (folder: TFolder, newName: string) => {
			const { moveFolder } = get();
			const newPath = folder.path.replace(folder.name, newName);
			await moveFolder(folder, newPath);
		},
		expandFolder: (folder: TFolder) => {
			const {
				changeExpandedFolderPaths,
				expandedFolderPaths,
				hasFolderChildren,
			} = get();
			if (!hasFolderChildren(folder) || folder.isRoot()) return;
			changeExpandedFolderPaths(
				uniq([...expandedFolderPaths, folder.path])
			);
		},
		collapseFolder: (folder: TFolder) => {
			const {
				changeExpandedFolderPaths,
				hasFolderChildren,
				expandedFolderPaths,
			} = get();
			if (!hasFolderChildren(folder) || folder.isRoot()) return;
			changeExpandedFolderPaths(
				expandedFolderPaths.filter((path) => path !== folder.path)
			);
		},
		getNameOfFolder: (folder: TFolder) => {
			return folder.isRoot() ? plugin.app.vault.getName() : folder.name;
		},
	});
