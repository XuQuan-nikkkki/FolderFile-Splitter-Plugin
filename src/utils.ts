import { FileManager, TAbstractFile, TFile, TFolder } from "obsidian";

type FolderChild = TFile | TFolder | TAbstractFile;
export const isFile = (item: FolderChild): item is TFile => {
	return item instanceof TFile;
};

export const isFolder = (item: FolderChild): item is TFolder => {
	return item instanceof TFolder;
};

export const moveFileOrFolder = (
	fileManager: FileManager,
	file: TAbstractFile,
	newFolder: TFolder
): Promise<void> => {
	const newPath = newFolder.path + "/" + file.name;
	return fileManager.renameFile(file, newPath);
};
