import { TAbstractFile, TFile, TFolder } from "obsidian";
import { FolderFileSplitterPluginSettings, DEFAULT_SETTINGS } from "./settings";
import { FFS_PLUGIN_SETTINGS } from "./assets/constants";

type FolderChild = TFile | TFolder | TAbstractFile;
export const isFile = (item: FolderChild): item is TFile => {
	return item instanceof TFile;
};

export const isFolder = (item: FolderChild): item is TFolder => {
	return item instanceof TFolder;
};

export const moveCursorToEnd = (element: HTMLElement) => {
	const range = document.createRange();
	const selection = window.getSelection();
	range.selectNodeContents(element);
	range.collapse(false);
	selection?.removeAllRanges();
	selection?.addRange(range);
};

export const selectText = (element: HTMLElement) => {
	element.focus();
	const range = document.createRange();
	range.selectNodeContents(element);
	const selection = window.getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
};
