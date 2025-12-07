import classNames from "classnames";
import { shell } from "electron";
import { Menu, normalizePath, TFile } from "obsidian";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { CLICKABLE_TREE_ITEM_CLASS_NAME } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useAutoScrollToCenter,
	useShowFileItemDivider,
} from "src/hooks/useSettingsHandler";
import { FILE_OPERATION_COPY } from "src/locales";
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

import { NameRef } from "../EditableName";
import { FolderListModal } from "../FolderListModal";
import ScrollInToViewContainer from "../ScrollInToViewContainer";

import FileContentInner from "./ContentInner";

export type FileInnerContentRef = {
	setIsFocusing: (isFocusing: boolean) => void;
	onStartEditingName: Noop;
};

export type FileProps = {
	file: TFile;
};
const FileContent = ({ file }: FileProps) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language, settings } = plugin;

	const {
		selectFileAndOpen,
		createFileWithDefaultName,
		duplicateFile,
		isFilePinned,
		pinFile,
		unpinFile,
		trashFile,
		isFocusedFile,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			selectFileAndOpen: store.selectFileAndOpen,
			createFileWithDefaultName: store.createFileWithDefaultName,
			duplicateFile: store.duplicateFile,
			isFilePinned: store.isFilePinned,
			pinFile: store.pinFile,
			unpinFile: store.unpinFile,
			trashFile: store.trashFile,
			isFocusedFile: store.isFocusedFile,

			focusedFile: store.focusedFile,
		}))
	);

	const { showFileItemDivider } = useShowFileItemDivider(
		settings.showFileItemDivider
	);
	const { autoScrollToCenter } = useAutoScrollToCenter(
		settings.autoScrollToCenter
	);

	const nameRef = useRef<NameRef>(null);

	const isFocused = isFocusedFile(file);

	const addPinInMenu = (menu: Menu) => {
		const isPinned = isFilePinned(file);
		addPinMenuItem(menu, {
			isPinned,
			pin: () => pinFile(file),
			unpin: () => unpinFile(file),
		});
	};

	const openFileInNewTab = (file: TFile) => {
		plugin.app.workspace.openLinkText(file.path, file.path, true);
		selectFileAndOpen(file);
	};

	const addOpenInNewTabMenuItem = (menu: Menu) => {
		addMenuItem(menu, {
			icon: "file-plus",
			title: FILE_OPERATION_COPY.openInNewTab[language],
			action: () => {
				openFileInNewTab(file);
			},
		});
	};

	const addDuplicateFileMenuItem = (menu: Menu) => {
		addMenuItem(menu, {
			title: FILE_OPERATION_COPY.duplicate[language],
			icon: "copy",
			action: async () => {
				await duplicateFile(file);
			},
		});
	};

	const onShowTargetFoldersList = () => {
		const modal = new FolderListModal(plugin, useExplorerStore, file);
		modal.open();
	};

	const onCreateFile = async () => {
		const folder = file.parent || plugin.app.vault.getRoot();
		await createFileWithDefaultName(folder);
	};

	const _getOpenInFileManagerTitle = () => {
		const isEn = language == "en";
		const isWin = process.platform === "win32";
		if (isEn) {
			return isWin ? "Show in Explorer" : "Reveal in Finder";
		} else {
			return isWin ? "在资源管理器中显示" : "在访达中显示";
		}
	}

	const openInFileManager = (menu: Menu) => {
		addMenuItem(menu, {
			title: _getOpenInFileManagerTitle(),
			icon: "move-up-right",
			action: () => {
				const vaultPath = plugin.app.vault.adapter.getBasePath();
				const abs = normalizePath(`${vaultPath}/${file.path}`);
				shell.showItemInFolder(abs);
			},
		});
	};

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		addPinInMenu(menu);
		menu.addSeparator();

		addOpenInNewTabMenuItem(menu);
		menu.addSeparator();

		addCreateFileMenuItem(menu, onCreateFile);
		addDuplicateFileMenuItem(menu);
		addMoveMenuItem(menu, onShowTargetFoldersList);
		menu.addSeparator();

		openInFileManager(menu);
		menu.addSeparator();

		addRenameMenuItem(menu, nameRef.current?.onStartEditingName ?? noop);
		addDeleteMenuItem(menu, () => trashFile(file));

		triggerMenu(plugin, menu, "file-context-menu")(e);
	};

	const getClassNames = () => {
		return classNames(
			"ffs__file-content nav-file-title tappable",
			CLICKABLE_TREE_ITEM_CLASS_NAME,
			{
				"is-active": isFocused,
				"ffs__file-content--divider": showFileItemDivider,
			}
		);
	};

	const onClickFile = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.ctrlKey || e.metaKey) {
			openFileInNewTab(file);
		} else if (isFocused) {
			e.stopPropagation();
			nameRef.current?.setIsFocusing(true);
		}
	};

	return (
		<ScrollInToViewContainer
			needToScroll={isFocused && autoScrollToCenter}
			className={getClassNames()}
			onContextMenu={onShowContextMenu}
			onClick={onClickFile}
		>
			<FileContentInner file={file} ref={nameRef} />
		</ScrollInToViewContainer>
	);
};

export default FileContent;
