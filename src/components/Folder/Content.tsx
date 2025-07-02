import classNames from "classnames";
import { Menu, TFolder } from "obsidian";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { FOLDER_OPERATION_COPY } from "src/locales";
import { ExplorerStore } from "src/store";
import {
	addCreateFileMenuItem,
	addDeleteMenuItem,
	addMenuItem,
	addMoveMenuItem,
	addPinMenuItem,
	addRenameMenuItem,
	noop,
	Noop,
	triggerMenu,
} from "src/utils";

import { FolderListModal } from "../FolderListModal";

import FolderContentInner from "./ContentInner";

export type FolderInnerContentRef = {
	setIsFocusing: (isFocusing: boolean) => void;
	onStartEditingName: Noop;
};

export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps;
const FolderContent = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		focusedFolder,
		changeFocusedFolder,
		createNewFolder,
		createFileWithDefaultName,
		pinFolder,
		unpinFolder,
		isFolderPinned,
		trashFolder,
		expandFolder,
		isFolderExpanded
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			changeFocusedFolder: store.changeFocusedFolder,
			createNewFolder: store.createNewFolder,
			createFileWithDefaultName: store.createFileWithDefaultName,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
			trashFolder: store.trashFolder,
			expandFolder: store.expandFolder,
			isFolderExpanded: store.isFolderExpanded
		}))
	);

	const isFocused = folder.path == focusedFolder?.path;

	const folderRef = useRef<HTMLDivElement>(null);
	const innerContentRef = useRef<FolderInnerContentRef>(null);

	useEffect(() => {
		if (focusedFolder?.path !== folder.path) return;
		setTimeout(() => {
			folderRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 100);
	}, [focusedFolder]);

	const addPinInMenu = (menu: Menu) => {
		const isPinned = isFolderPinned(folder);
		addPinMenuItem(menu, {
			isPinned,
			pin: () => pinFolder(folder),
			unpin: () => unpinFolder(folder),
		});
	};

	const onShowTargetFoldersList = () => {
		const modal = new FolderListModal(plugin, useExplorerStore, folder);
		modal.open();
	};

	const onCreateNewFile = async () => {
		if (folder.path !== focusedFolder?.path) {
			await changeFocusedFolder(folder);
		}
		await createFileWithDefaultName(folder);
	};

	const onCreateNewFolder = async () => {
		const newFolder = await createNewFolder(folder);
		if (!isFolderExpanded(folder)) {
			expandFolder(folder);
		}
		if (newFolder) {
			await changeFocusedFolder(newFolder);
		}
	};

	const addCreateFolderMenuItem = (menu: Menu) => {
		addMenuItem(menu, {
			title: FOLDER_OPERATION_COPY.createFolder[language],
			icon: "folder-open",
			action: onCreateNewFolder,
		});
	};

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		const isRootFolder = folder.isRoot();

		addPinInMenu(menu);
		menu.addSeparator();

		addCreateFileMenuItem(menu, onCreateNewFile);
		addCreateFolderMenuItem(menu);
		menu.addSeparator();

		addMoveMenuItem(menu, onShowTargetFoldersList, isRootFolder);
		menu.addSeparator();

		addRenameMenuItem(
			menu,
			innerContentRef?.current?.onStartEditingName ?? noop,
			isRootFolder
		);
		addDeleteMenuItem(menu, () => trashFolder(folder));

		triggerMenu(plugin, menu, "folder-context-menu")(e);
	};

	return (
		<div
			className={classNames("ffs__folder")}
			onContextMenu={onShowContextMenu}
			onClick={() => {
				if (isFocused) {
					folderRef.current?.focus();
					innerContentRef.current?.setIsFocusing(true);
				}
			}}
		>
			<FolderContentInner folder={folder} />
		</div>
	);
};

export default FolderContent;
