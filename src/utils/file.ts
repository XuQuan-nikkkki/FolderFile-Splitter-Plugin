import { Menu, TAbstractFile, TFile, TFolder } from "obsidian";
import { MouseEvent } from "react";

import FolderFileSplitterPlugin from "src/main";
import { FileSortRule } from "src/store/file/sort";
import { FolderSortRule } from "src/store/folder/sort";

type FolderChild = TFile | TFolder | TAbstractFile;
export const isFile = (item: FolderChild): item is TFile => {
	return item instanceof TFile;
};

export const isFolder = (item: FolderChild): item is TFolder => {
	return item instanceof TFolder;
};

type MenuRule = {
	title: string;
	icon?: string;
	checked?: boolean;
	action: () => void;
};
export const addMenuItem = (menu: Menu, rule: MenuRule): void => {
	const { title, icon, checked, action } = rule;
	menu.addItem((item) => {
		item.setTitle(title);
		if (icon) {
			item.setIcon(icon);
		}
		if (checked) {
			item.setChecked(checked);
		}
		item.onClick(action);
	});
};

export const triggerMenu =
	(plugin: FolderFileSplitterPlugin, menu: Menu, menuName: string) =>
	(e: MouseEvent<HTMLDivElement>): void => {
		plugin.app.workspace.trigger(menuName, menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

export type SortRule = FolderSortRule | FileSortRule;
export const isInAscendingOrderRule = (rule: SortRule): boolean => {
	return rule.contains("Ascending");
};

export const isManualSortOrderRule = (rule: SortRule): boolean => {
	return rule.contains("ManualOrder");
};
