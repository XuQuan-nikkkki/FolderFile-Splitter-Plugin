export type Lang = "en" | "zh";
type Copy = Record<string, Record<Lang, string>>;

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
}