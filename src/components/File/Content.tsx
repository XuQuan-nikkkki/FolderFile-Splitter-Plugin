import classNames from "classnames";
import { Menu, TFile } from "obsidian";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useShowFileItemDivider } from "src/hooks/useSettingsHandler";
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

import { FolderListModal } from "../FolderListModal";

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
		focusedFile,
		selectFileAndOpen,
		createFileWithDefaultName,
		duplicateFile,
		isFilePinned,
		pinFile,
		unpinFile,
		trashFile,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFile: store.focusedFile,
			selectFileAndOpen: store.selectFileAndOpen,
			createFileWithDefaultName: store.createFileWithDefaultName,
			duplicateFile: store.duplicateFile,
			isFilePinned: store.isFilePinned,
			pinFile: store.pinFile,
			unpinFile: store.unpinFile,
			trashFile: store.trashFile,
		}))
	);

	const { showFileItemDivider } = useShowFileItemDivider(
		settings.showFileItemDivider
	);

	const isFocused = focusedFile?.path === file.path;
	const fileRef = useRef<HTMLDivElement>(null);
	const innerContentRef = useRef<FileInnerContentRef>(null);

	useEffect(() => {
		if (focusedFile?.path !== file.path) return;
		setTimeout(() => {
			fileRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 100);
	}, [focusedFile]);

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

		addRenameMenuItem(
			menu,
			innerContentRef.current?.onStartEditingName ?? noop
		);
		addDeleteMenuItem(menu, () => trashFile(file));

		triggerMenu(plugin, menu, "file-context-menu")(e);
	};

	const getClassNames = () => {
		return classNames(
			"ffs__file-content tree-item-self nav-file-title tappable is-clickable",
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
			fileRef.current?.focus();
			innerContentRef.current?.setIsFocusing(true);
		}
	};

	return (
		<div
			className={getClassNames()}
			ref={fileRef}
			onContextMenu={onShowContextMenu}
			onClick={onClickFile}
		>
			<FileContentInner
				file={file}
				ref={innerContentRef}
				fileRef={fileRef}
			/>
		</div>
	);
};

export default FileContent;
