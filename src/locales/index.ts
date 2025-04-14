export type Lang = "en" | "zh";
export type Copy = Record<string, Record<Lang, string>>;

export const FOLDER_OPERATION_COPY: Copy = {
	pinFolder: {
		en: "Pin folder",
		zh: "置顶",
	},
	unpinFolder: {
		en: "Unpin folder",
		zh: "取消置顶",
	},
	createFile: {
		en: "New note",
		zh: "新建笔记",
	},
	createFolder: {
		en: "New folder",
		zh: "新建文件夹",
	},
	moveFolder: {
		en: "Move folder to...",
		zh: "移动到...",
	},
	renameFolder: {
		en: "Rename folder",
		zh: "重命名",
	},
	deleteFolder: {
		en: "Delete",
		zh: "删除",
	},
};

export const FILE_OPERATION_COPY: Copy = {
	pinFile: {
		en: "Pin file",
		zh: "置顶",
	},
	unpinFile: {
		en: "Unpin file",
		zh: "取消置顶",
	},
	openInNewTab: {
		en: "Open in new tab",
		zh: "在新标签页打开",
	},
	newNote: {
		en: "New note",
		zh: "新建笔记",
	},
	duplicate: {
		en: "Duplicate",
		zh: "复制",
	},
	moveFile: {
		en: "Move file to...",
		zh: "移动到...",
	},
	rename: {
		en: "Rename",
		zh: "重命名",
	},
	delete: {
		en: "Delete",
		zh: "删除",
	},
};

export const TIPS_COPY: Copy = {
	dragToSortFolders: {
		en: "Drag to sort folders",
		zh: "拖动文件夹排序",
	},
	dragToSortFiles: {
		en: "Drag to sort files",
		zh: "拖动笔记排序",
	},
};

export const FOLDER_SORT_RULES_COPY: Copy = {
	folderNameAscending: {
		en: "Folder name(A to Z)",
		zh: "按文件夹名升序",
	},
	folderNameDescending: {
		en: "Folder name(Z to A)",
		zh: "按文件夹名降序",
	},
	filesCountAscending: {
		en: "Files count(small to large)",
		zh: "按文件数（从少到多）",
	},
	filesCountDescending: {
		en: "Files count(large to small)",
		zh: "按文件数（从多到少）",
	},
	manualOrder: {
		en: "Manual order",
		zh: "手动排序",
	},
};

export const FILE_SORT_RULES_COPY: Copy = {
	fileNameAscending: {
		en: "File name(A to Z)",
		zh: "按文件名升序",
	},
	fileNameDescending: {
		en: "File name(Z to A)",
		zh: "按文件名降序",
	},
	modifiledTimeDescending: {
		en: "Modifiled time(new to old)",
		zh: "按修改时间（从新到旧）",
	},
	modifiledTimeAscending: {
		en: "Modifiled time(old to new)",
		zh: "按修改时间（从旧到新）",
	},
	createdTimeDescending: {
		en: "Created time(new to old)",
		zh: "按创建时间（从新到旧）",
	},
	createdTimeAscending: {
		en: "Created time(old to new)",
		zh: "按创建时间（从旧到新）",
	},
	manualOrder: {
		en: "Manual order",
		zh: "手动排序",
	},
};
