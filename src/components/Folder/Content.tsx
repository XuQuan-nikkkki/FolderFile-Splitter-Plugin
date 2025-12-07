import { shell } from "electron";
import { FileSystemAdapter, Menu, normalizePath, TFolder } from "obsidian";
import { useRef } from "react";
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
	triggerMenu,
} from "src/utils";

import { NameRef } from "../EditableName";
import { FolderListModal } from "../FolderListModal";
import TogglableContainer from "../TogglableContainer";

import FolderFilesCount from "./FilesCount";
import FolderIcon from "./Icon";
import FolderName from "./Name";

export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps;
const FolderContent = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		changeFocusedFolder,
		createNewFolderAndFocus,
		createNewFileAndFocus,
		pinFolder,
		unpinFolder,
		isFolderPinned,
		trashFolder,
		toggleFolder,
		isFocusedFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			changeFocusedFolder: store.changeFocusedFolder,
			createNewFolderAndFocus: store.createNewFolderAndFocus,
			createNewFileAndFocus: store.createNewFileAndFocus,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
			trashFolder: store.trashFolder,
			toggleFolder: store.toggleFolder,
			isFocusedFolder: store.isFocusedFolder,

			focusedFolder: store.focusedFolder,
		}))
	);

	const nameRef = useRef<NameRef>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const isFocused = isFocusedFolder(folder);

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

	const _getOpenInFileManagerTitle = () => {
		const isEn = language == "en";
		const isWin = process.platform === "win32";
		if (isEn) {
			return isWin ? "Show in Explorer" : "Reveal in Finder";
		} else {
			return isWin ? "在资源管理器中显示" : "在访达中显示";
		}
	};

	const openFolderInFileManager = (menu: Menu) => {
		addMenuItem(menu, {
			title: _getOpenInFileManagerTitle(),
			icon: "move-up-right",
			action: () => {
				const vaultPath = (
					plugin.app.vault.adapter as FileSystemAdapter
				).getBasePath();
				const abs = normalizePath(`${vaultPath}/${folder.path}`);
				shell.showItemInFolder(abs);
			},
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

		openFolderInFileManager(menu);
		menu.addSeparator();

		addRenameMenuItem(
			menu,
			nameRef?.current?.onStartEditingName ?? noop,
			isRootFolder
		);
		addDeleteMenuItem(menu, () => trashFolder(folder));

		triggerMenu(plugin, menu, "folder-context-menu")(e);
	};

	return (
		<TogglableContainer
			nameRef={nameRef}
			isFocused={isFocused}
			onSelect={async () => await changeFocusedFolder(folder)}
			onToggleExpand={() => toggleFolder(folder)}
			className="ffs__folder"
			onContextMenu={onShowContextMenu}
		>
			<div className="ffs__folder-content--main" ref={contentRef}>
				<FolderIcon folder={folder} />
				<FolderName
					folder={folder}
					ref={nameRef}
					contentRef={contentRef}
				/>
				<FolderFilesCount folder={folder} />
			</div>
		</TogglableContainer>
	);
};

export default FolderContent;
