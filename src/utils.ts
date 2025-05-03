import { TAbstractFile, TFile, TFolder } from "obsidian";

type FolderChild = TFile | TFolder | TAbstractFile;
export const isFile = (item: FolderChild): item is TFile => {
	return item instanceof TFile;
};

export const isFolder = (item: FolderChild): item is TFolder => {
	return item instanceof TFolder;
};

export const isAbstractFileIncluded = (
	files: TAbstractFile[],
	file: TAbstractFile
): boolean => files.some((f) => f.path === file.path);

export const pluralize = (count: number, word: string): string => {
	return `${count} ${word}${count > 1 ? "s" : ""}`;
};

export const uniq = <T>(array: T[]): T[] => {
	return Array.from(new Set(array));
}