import { create } from "zustand";
import { getAllTags, TFile, TFolder } from "obsidian";

import FolderFileSplitterPlugin from "./main";
import { isFile } from "./utils";
import {
	FFS_FILE_MANUAL_SORT_ORDER_KEY,
	FFS_FILE_SORT_RULE_KEY,
	FFS_FOCUSED_FILE_PATH_KEY,
	FFS_PINNED_FILE_PATHS_KEY,
} from "./assets/constants";
import { CommonExplorerStore, createCommonExplorerStore } from "./store/common";
import { createFolderExplorerStore, FolderExplorerStore } from "./store/folder";

export type TagSortRule =
	| "TagNameAscending"
	| "TagNameDescending"
	| "FileCountAscending"
	| "FileCountDescending";
export const DEFAULT_TAG_SORT_RULE: TagSortRule = "TagNameAscending";
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

type FolderPath = string;
type ChildrenPaths = string[];
export type ManualSortOrder = Record<FolderPath, ChildrenPaths>;

export type TagNode = {
	name: string;
	files: TFile[];
	parent: string | null;
	fullPath: string;
	children: Set<string>;
};
export type TagTree = Map<string, TagNode>;

export type ExplorerStore = CommonExplorerStore &
	FolderExplorerStore & {
		focusedFile: TFile | null;
		pinnedFilePaths: string[];
		fileSortRule: FileSortRule;
		filesManualSortOrder: ManualSortOrder;
		tagTree: TagTree;
		tagSortRule: TagSortRule;
		expandedTagPaths: string[];
		focusedTag: TagNode | null;

		restoreData: () => Promise<void>;

		// Tags related
		generateTagTree: () => TagTree;
		getTopLevelTags: () => TagNode[];
		getFilesCountInTag: (tagNode: TagNode) => number;
		sortTags: (tags: TagNode[]) => TagNode[];
		getTagsByParent: (parentTag: string) => TagNode[];
		hasTagChildren: (tagNode: TagNode) => boolean;

		// Files related
		findFileByPath: (path: string) => TFile | null;
		isFilesInAscendingOrder: () => boolean;
		setFocusedFile: (file: TFile | null) => Promise<void>;
		openFile: (file: TFile, focus?: boolean) => void;
		selectFile: (file: TFile, focus?: boolean) => Promise<void>;
		readFile: (file: TFile) => Promise<string>;
		createFile: (folder: TFolder) => Promise<TFile | undefined>;
		duplicateFile: (file: TFile) => Promise<TFile>;
		restoreLastFocusedFile: () => Promise<void>;
		changeFileSortRule: (rule: FileSortRule) => Promise<void>;
		restoreFileSortRule: () => Promise<void>;
		sortFiles: (files: TFile[], rule: FileSortRule) => TFile[];
		pinFile: (file: TFile) => Promise<void>;
		unpinFile: (file: TFile) => Promise<void>;
		_updatePinnedFilePath: (
			oldPath: string,
			newPath: string
		) => Promise<void>;
		_updatePinnedFilePaths: (paths: string[]) => Promise<void>;
		isFilePinned: (file: TFile) => boolean;
		restorePinnedFiles: () => Promise<void>;
		initFilesManualSortOrder: () => Promise<void>;
		getInitialFilesOrder: () => ManualSortOrder;
		restoreFilesManualSortOrder: () => Promise<void>;
		updateFileManualOrder: (
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
		_updateAndSaveFilesOrder: (
			updatedOrder: ManualSortOrder
		) => Promise<void>;
		trashFile: (file: TFile) => Promise<void>;
		moveFile: (file: TFile, newPath: string) => Promise<void>;
		renameFile: (file: TFile, newName: string) => Promise<void>;
		updateFilePinState: (oldPath: string, newPath: string) => Promise<void>;
	};

export const createExplorerStore = (plugin: FolderFileSplitterPlugin) =>
	create<ExplorerStore>((set, get, store) => ({
		...createCommonExplorerStore(plugin)(set, get, store),
		...createFolderExplorerStore(plugin)(set, get, store),
		focusedFile: null,
		pinnedFilePaths: [],
		fileSortRule: DEFAULT_FILE_SORT_RULE,
		filesManualSortOrder: {},
		tagTree: new Map(),
		tagSortRule: DEFAULT_TAG_SORT_RULE,
		expandedTagPaths: [],
		focusedTag: null,

		restoreData: async () => {
			const {
				restoreLastFocusedFolder,
				restoreLastFocusedFile,
				restoreFolderSortRule,
				restoreFileSortRule,
				restoreExpandedFolderPaths,
				restorePinnedFolders,
				restorePinnedFiles,
				generateTagTree,
			} = get();
			await Promise.all([
				restoreLastFocusedFolder(),
				restoreLastFocusedFile(),
				restoreFolderSortRule(),
				restoreFileSortRule(),
				restoreExpandedFolderPaths(),
				restorePinnedFolders(),
				restorePinnedFiles(),
				generateTagTree(),
			]);
		},

		// Tags related
		generateTagTree: () => {
			const tagTree: TagTree = new Map();
			const files = plugin.app.vault.getMarkdownFiles();
			if (!files || files.length === 0) return tagTree;

			files.forEach((file) => {
				const cache = plugin.app.metadataCache.getFileCache(file);
				if (!cache) return;

				const tags = getAllTags(cache);
				if (!tags || tags.length === 0) return;

				const getOrCreateTagNode = (
					tagName: string,
					fullPath: string,
					parent: string | null = null
				): TagNode => {
					if (!tagTree.has(fullPath)) {
						tagTree.set(fullPath, {
							name: tagName,
							files: [],
							parent,
							fullPath,
							children: new Set(),
						});
					}
					return tagTree.get(fullPath) as TagNode;
				};

				tags.forEach((tag) => {
					const tagParts = tag.replace("#", "").split("/");
					let parentTag: string | null = null;

					tagParts.forEach((part, index) => {
						const fullTagPath = tagParts
							.slice(0, index + 1)
							.join("/");
						const tagNode = getOrCreateTagNode(
							part,
							fullTagPath,
							parentTag
						);

						if (index === tagParts.length - 1) {
							tagNode.files.push(file);
						}

						if (parentTag) {
							const parentNode = tagTree.get(parentTag);
							if (parentNode) {
								parentNode.children.add(fullTagPath);
							}
						}

						parentTag = fullTagPath;
					});
				});
			});

			set({
				tagTree,
			});
			return tagTree;
		},

		getTopLevelTags: () => {
			const { tagTree } = get();
			return Array.from(tagTree.values()).filter(
				(tagNode) => !tagNode.parent
			);
		},

		getFilesCountInTag: (tagNode: TagNode): number => {
			if (!tagNode || !tagNode.files) return 0;

			const { tagTree } = get();
			const { includeSubTagFiles } = plugin.settings;
			let totalCount = tagNode.files.length;
			if (!includeSubTagFiles) return totalCount;

			tagNode.children.forEach((childTagName) => {
				const childNode = tagTree.get(childTagName);
				if (childNode) {
					totalCount += childNode.files.length;
				}
			});
			return totalCount;
		},

		sortTags: (tags: TagNode[]): TagNode[] => {
			const { getFilesCountInTag, tagSortRule: rule } = get();
			switch (rule) {
				case "TagNameAscending":
					return tags.sort((a, b) => a.name.localeCompare(b.name));
				case "TagNameDescending":
					return tags.sort((a, b) => b.name.localeCompare(a.name));
				case "FileCountAscending":
					return tags.sort(
						(a, b) => getFilesCountInTag(a) - getFilesCountInTag(b)
					);
				case "FileCountDescending":
					return tags.sort(
						(a, b) => getFilesCountInTag(b) - getFilesCountInTag(a)
					);
				default:
					return tags;
			}
		},

		getTagsByParent: (parentTag: string): TagNode[] => {
			const { tagTree } = get();
			const tags = Array.from(tagTree.values()).filter(
				(tagNode) => tagNode.parent === parentTag
			);
			return tags;
		},

		hasTagChildren: (tag: TagNode): boolean => {
			return tag.children && tag.children.size > 0;
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
			const { fileSortRule, sortFiles, getFilesInFolder } = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				if (folder) {
					const files = getFilesInFolder(folder);
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
				sortFiles,
				getFilesInFolder,
				saveDataInPlugin,
			} = get();
			const foldersToInit = plugin.app.vault.getAllFolders(true);
			const order: ManualSortOrder = {};
			foldersToInit.forEach((folder) => {
				const files = getFilesInFolder(folder);
				if (files.length) {
					const sortedFiles = sortFiles(files, fileSortRule);
					order[folder.path] = sortedFiles.map((file) => file.path);
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
			const {
				getDataFromPlugin,
				getInitialFilesOrder,
				_updateAndSaveFilesOrder,
			} = get();
			const { vault } = plugin.app;
			const order = getInitialFilesOrder();
			const previousOrder =
				(await getDataFromPlugin<ManualSortOrder>(
					FFS_FILE_MANUAL_SORT_ORDER_KEY
				)) ?? {};
			Object.keys(previousOrder).forEach((path) => {
				if (!vault.getFolderByPath(path)) return;
				const paths = previousOrder[path].filter((path) =>
					Boolean(vault.getFileByPath(path))
				);
				if (paths.length > 0) {
					order[path] = paths;
				}
			});
			await _updateAndSaveFilesOrder(order);
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
		trashFile: async (file: TFile) => {
			const { setFocusedFile, focusedFile } = get();
			const { app } = plugin;
			if (file.path === focusedFile?.path) {
				await setFocusedFile(null);
			}
			await app.fileManager.trashFile(file);
		},
		_updatePinnedFilePath: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, _updatePinnedFilePaths } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;

			const pinnedIndex = pinnedFilePaths.indexOf(oldPath);
			const paths = [...pinnedFilePaths];
			paths.splice(pinnedIndex, 1, newPath);
			await _updatePinnedFilePaths(paths);
		},
		updateFileManualOrder: async (
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
		updateFilePinState: async (oldPath: string, newPath: string) => {
			const { pinnedFilePaths, _updatePinnedFilePath } = get();
			if (!pinnedFilePaths.includes(oldPath)) return;
			await _updatePinnedFilePath(oldPath, newPath);
		},
		moveFile: async (file: TFile, newPath: string) => {
			await plugin.app.fileManager.renameFile(file, newPath);
		},
		renameFile: async (file: TFile, newName: string) => {
			const { moveFile } = get();
			const newPath = file.path.replace(file.basename, newName);
			await moveFile(file, newPath);
		},
	}));
