import { Menu } from "obsidian";
import { MouseEvent } from "react";

import FolderFileSplitterPlugin from "src/main";

import { AsyncNoop, Noop } from "./function";

export const getLanguage = (): "zh" | "en" =>
	document.documentElement.getAttribute("lang")?.startsWith("zh")
		? "zh"
		: "en";
export const isZh = getLanguage() === "zh";

type MenuRule = {
	title: string;
	icon?: string;
	checked?: boolean;
	disabled?: boolean;
	action: () => void;
};
export const addMenuItem = (menu: Menu, rule: MenuRule): void => {
	const { title, icon, checked, disabled = false, action } = rule;
	menu.addItem((item) => {
		item.setTitle(title);
		if (icon) {
			item.setIcon(icon);
		}
		if (checked) {
			item.setChecked(checked);
		}
		item.setDisabled(disabled);
		item.onClick(action);
	});
};

type PinMenuRule = {
	isPinned: boolean;
	pin: () => Promise<void>;
	unpin: () => Promise<void>;
};
export const addPinMenuItem = (menu: Menu, rule: PinMenuRule) => {
	const { isPinned, pin, unpin } = rule;
	menu.addItem((item) => {
		let title = "";
		if (isPinned) {
			title = isZh ? "取消置顶" : "Unpin";
		} else {
			title = isZh ? "置顶" : "Pin";
		}
		item.setTitle(title);
		item.setIcon(isPinned ? "pin-off" : "pin");
		item.onClick(async () => {
			isPinned ? unpin() : pin();
		});
	});
};

export const addCreateFileMenuItem = (menu: Menu, onCreateFile: AsyncNoop) => {
	menu.addItem((item) => {
		item.setIcon("square-pen");
		item.setTitle(isZh ? "新建笔记" : "New note");
		item.onClick(onCreateFile);
	});
};

export const addRenameMenuItem = (
	menu: Menu,
	onRename: Noop,
	disabled = false
) => {
	menu.addItem((item) => {
		item.setIcon("pencil-line");
		item.setTitle(isZh ? "重命名" : "Rename");
		item.setDisabled(disabled);
		item.onClick(onRename);
	});
};

export const addMoveMenuItem = (menu: Menu, onMove: Noop, disabled = false) => {
	menu.addItem((item) => {
		item.setIcon("folder-tree");
		item.setTitle(isZh ? "移动到..." : "Move to ...");
		item.setDisabled(disabled);
		item.onClick(onMove);
	});
};

export const addDeleteMenuItem = (menu: Menu, onDelete: AsyncNoop) => {
	menu.addItem((item) => {
		const fragment = document.createDocumentFragment();
		const titleSpan = document.createElement("span");
		titleSpan.style.color = "#D04255";
		titleSpan.textContent = isZh ? "删除" : "Delete";
		fragment.append(titleSpan);
		item.setTitle(fragment);
		item.setIcon("trash-2");
		item.onClick(onDelete);
	});
};

export const triggerMenu =
	(plugin: FolderFileSplitterPlugin, menu: Menu, menuName: string) =>
	(e: MouseEvent<HTMLDivElement>): void => {
		plugin.app.workspace.trigger(menuName, menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};
