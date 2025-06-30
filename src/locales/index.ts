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

export const TAG_OPERATION_COPY: Copy = {
	pinTag: {
		en: "Pin tag",
		zh: "置顶",
	},
	unpinTag: {
		en: "Unpin tag",
		zh: "取消置顶",
	},
	moveTag: {
		en: "Move tag to...",
		zh: "移动到...",
	},
	renameTag: {
		en: "Rename tag",
		zh: "重命名",
	},
	deleteTag: {
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
	showFolders: {
		en: "Show folder list",
		zh: "显示文件夹列表",
	},
	hideFolders: {
		en: "Hide folder list",
		zh: "隐藏文件夹列表",
	},
	showTags: {
		en: "Show tag list",
		zh: "显示标签列表",
	},
	hideTags: {
		en: "Hide tag list",
		zh: "隐藏标签列表",
	},
	collapseFoldersAndTags: {
		en: "Collapse all folders and tags",
		zh: "折叠所有的文件夹和标签",
	},
	expandFoldersAndTags: {
		en: "Expand all folders and tags",
		zh: "展开所有的文件夹和标签",
	},
};

export const FOLDER_SORT_RULES_COPY: Copy = {
	FolderNameAscending: {
		en: "Folder/Tag name(A to Z)",
		zh: "按文件夹/标签名升序",
	},
	FolderNameDescending: {
		en: "Folder/Tag name(Z to A)",
		zh: "按文件夹/标签名降序",
	},
	FilesCountAscending: {
		en: "Files count(small to large)",
		zh: "按文件数（从少到多）",
	},
	FilesCountDescending: {
		en: "Files count(large to small)",
		zh: "按文件数（从多到少）",
	},
	FolderManualOrder: {
		en: "Manual order",
		zh: "手动排序",
	},
};

export const FILE_SORT_RULES_COPY: Copy = {
	FileNameAscending: {
		en: "File name(A to Z)",
		zh: "按文件名升序",
	},
	FileNameDescending: {
		en: "File name(Z to A)",
		zh: "按文件名降序",
	},
	FileModifiedTimeDescending: {
		en: "Modifiled time(new to old)",
		zh: "按修改时间（从新到旧）",
	},
	FileModifiedTimeAscending: {
		en: "Modifiled time(old to new)",
		zh: "按修改时间（从旧到新）",
	},
	FileCreatedTimeDescending: {
		en: "Created time(new to old)",
		zh: "按创建时间（从新到旧）",
	},
	FileCreatedTimeAscending: {
		en: "Created time(old to new)",
		zh: "按创建时间（从旧到新）",
	},
	FileManualOrder: {
		en: "Manual order",
		zh: "手动排序",
	},
};

export const VERTICAL_SPLIT_LAYOUT_OPERATION_COPY: Copy = {
	openFoldersAndTags: {
		en: "Open folders/tags",
		zh: "展开文件夹/标签列表",
	},
	closeFoldersAndTags: {
		en: "Close folders/tags",
		zh: "关闭文件夹/标签列表",
	},
	openFiles: {
		en: "Open files",
		zh: "展开文件列表",
	},
	closeFiles: {
		en: "Close files",
		zh: "关闭文件列表",
	},
};

export const SORT_TIPS_COPY: Copy = {
	sortFiles: {
		en: "Sort files",
		zh: "对文件排序",
	},
	sortFoldersAndTags: {
		en: "Sort folders and tags",
		zh: "对文件夹和标签排序",
	},
};
