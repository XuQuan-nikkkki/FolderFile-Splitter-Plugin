import { TFolder } from "obsidian";

import { isZh, pluralize } from "src/utils";

export const getPopupInfo = (folder: TFolder, foldersCount: number, filesCount: number) => {
	const { name } = folder;

	const filesCountInfo = pluralize(filesCount, "file");
	const foldersCountInfo = pluralize(foldersCount, "folder");

	if (isZh) {
		return `${name}\n${filesCount} 条笔记，${foldersCount} 个文件夹`;
	}
	return `${name}\n${filesCountInfo}, ${foldersCountInfo}`;
};
