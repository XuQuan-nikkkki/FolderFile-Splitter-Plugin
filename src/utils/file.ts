import { TAbstractFile, TFile, TFolder } from "obsidian";

import { FileSortRule } from "src/store/file/sort";
import { FolderSortRule } from "src/store/folder/sort";

type FolderChild = TFile | TFolder | TAbstractFile;
export const isFile = (item: FolderChild): item is TFile => {
	return item instanceof TFile;
};

export const isFolder = (item: FolderChild): item is TFolder => {
	return item instanceof TFolder;
};

export type SortRule = FolderSortRule | FileSortRule;
export const isInAscendingOrderRule = (rule: SortRule): boolean => {
	return rule.contains("Ascending");
};

export const isManualSortOrderRule = (rule: SortRule): boolean => {
	return rule.contains("ManualOrder");
};

export const removeFrontMatter = (content: string): string =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
