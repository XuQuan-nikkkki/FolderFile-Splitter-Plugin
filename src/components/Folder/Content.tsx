import classNames from "classnames";
import { Menu, TFolder } from "obsidian";
import { MouseEvent, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useExpandNodeByClick } from "src/hooks/useSettingsHandler";
import { FOLDER_OPERATION_COPY } from "src/locales";
import { EXPAND_NODE_ON_CLICK } from "src/settings";
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

export type FolderNameRef = {
	isFocusing: boolean;
	setIsFocusing: (isFocusing: boolean) => void;
	onStartEditingName: Noop;
};

export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps;
const FolderContent = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language, settings } = plugin;

	const {
		focusedFolder,
		changeFocusedFolder,
		createNewFolderAndFocus,
		createNewFileAndFocus,
		pinFolder,
		unpinFolder,
		isFolderPinned,
		trashFolder,
		toggleFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			changeFocusedFolder: store.changeFocusedFolder,
			createNewFolderAndFocus: store.createNewFolderAndFocus,
			createNewFileAndFocus: store.createNewFileAndFocus,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
			trashFolder: store.trashFolder,
			toggleFolder: store.toggleFolder,
		}))
	);

	const { expandNodeByClick } = useExpandNodeByClick(
		settings.expandNodeOnClick
	);

	const folderRef = useRef<HTMLDivElement>(null);
	const nameRef = useRef<FolderNameRef>(null);

	useEffect(() => {
		nameRef.current?.setIsFocusing(false)

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

	const addCreateFolderMenuItem = (menu: Menu) => {
		addMenuItem(menu, {
			title: FOLDER_OPERATION_COPY.createFolder[language],
			icon: "folder-open",
			action: async () => await createNewFolderAndFocus(folder),
		});
	};

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		const isRootFolder = folder.isRoot();

		addPinInMenu(menu);
		menu.addSeparator();

		addCreateFileMenuItem(
			menu,
			async () => await createNewFileAndFocus(folder)
		);
		addCreateFolderMenuItem(menu);
		menu.addSeparator();

		addMoveMenuItem(menu, onShowTargetFoldersList, isRootFolder);
		menu.addSeparator();

		addRenameMenuItem(
			menu,
			nameRef?.current?.onStartEditingName ?? noop,
			isRootFolder
		);
		addDeleteMenuItem(menu, () => trashFolder(folder));

		triggerMenu(plugin, menu, "folder-context-menu")(e);
	};

	const onClickFolderContent = async (e: MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()
		await changeFocusedFolder(folder);
		if (expandNodeByClick === EXPAND_NODE_ON_CLICK.LABEL) {
			toggleFolder(folder);
		} else if (expandNodeByClick === EXPAND_NODE_ON_CLICK.SELECTED_LABEL) {
			folderRef.current?.focus();
			if (nameRef.current?.isFocusing) {
				toggleFolder(folder);
			} else {
				nameRef.current?.setIsFocusing(true);
			}
		}
	};

	return (
		<div
			className={classNames("ffs__folder")}
			onContextMenu={onShowContextMenu}
			onClick={onClickFolderContent}
		>
			<FolderContentInner folder={folder} ref={folderRef} nameRef={nameRef} />
		</div>
	);
};

export default FolderContent;
