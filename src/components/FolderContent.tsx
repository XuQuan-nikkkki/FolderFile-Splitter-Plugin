import { Menu, TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
} from "src/hooks/useSettingsHandler";
import useRenderFolderName from "../hooks/useRenderFolderName";
import FilesCount from "./FilesCount";
import FolderExpandIcon from "./FolderExpandIcon";
import {
	FolderLeftSection,
	StyledFolder,
	StyledFolderIcon,
} from "./Styled/StyledFolder";
import { useFileTree } from "./FileTree";
import { useEffect, useRef, useState } from "react";

export type FolderProps = {
	folder: TFolder;
	isRoot?: boolean;
	hideExpandIcon?: boolean;
	isOver?: boolean;
};
type Props = FolderProps & {
	onToggleExpandState: () => void;
};
const FolderContent = ({
	folder,
	isRoot = false,
	hideExpandIcon = false,
	isOver = false,
	onToggleExpandState,
}: Props) => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		focusedFolder,
		setFocusedFolder,
		expandedFolderPaths,
		createNewFolder,
		createFile,
		focusedFile,
		pinFolder,
		unpinFolder,
		isFolderPinned,
		trashFolder,
		renameFolder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			focusedFile: store.focusedFile,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
			trashFolder: store.trashFolder,
			renameFolder: store.renameFolder,
		}))
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);
	const isFocused = folder.path == focusedFolder?.path;
	const isFocusedFileInFolder = focusedFile?.parent?.path === folder.path;
	const isFocusedOnFile = isFocused && focusedFile && isFocusedFileInFolder;
	const isFocusedOnFolder = isFocused && !isFocusedOnFile;

	const onSaveName = (name: string) => renameFolder(folder, name);
	const { renderFolderName, selectFileNameText, onBeginEdit } =
		useRenderFolderName(folder, plugin, onSaveName, {
			isRoot,
			isFocused: isFocusedOnFolder,
		});

	const folderRef = useRef<HTMLDivElement>(null);
	const [isFocusing, setIsFocusing] = useState<boolean>(false);

	const onClickOutside = (event: MouseEvent) => {
		if (
			folderRef.current &&
			!folderRef.current.contains(event.target as Node)
		) {
			setIsFocusing(false);
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && isFocusing) {
			onBeginEdit();
			setTimeout(() => {
				selectFileNameText();
			}, 100);
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [isFocusing]);

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		menu.addItem((item) => {
			const isPinned = isFolderPinned(folder);
			const title = isPinned ? "Unpin folder" : "Pin folder";
			item.setTitle(title);
			item.onClick(() => {
				if (isPinned) {
					unpinFolder(folder);
				} else {
					pinFolder(folder);
				}
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("New note");
			item.onClick(async () => {
				if (folder.path !== focusedFolder?.path) {
					await setFocusedFolder(folder);
				}
				await createFile(folder);
			});
		});
		menu.addItem((item) => {
			item.setTitle("New folder");
			item.onClick(() => {
				createNewFolder(folder);
				if (!isFolderExpanded) {
					onToggleExpandState();
				}
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Move folder to...");
			item.onClick(() => {
				const modal = new FolderListModal(
					plugin,
					useFileTreeStore,
					folder
				);
				modal.open();
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Rename folder");
			item.onClick(() => {
				onBeginEdit();
				setTimeout(() => {
					selectFileNameText();
				}, 100);
			});
		});
		menu.addItem((item) => {
			item.setTitle("Delete");
			item.onClick(async () => {
				trashFolder(folder);
			});
		});
		plugin.app.workspace.trigger("folder-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const onClickFolderName = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "folder") return;
		if (focusedFolder?.path !== folder.path) {
			setFocusedFolder(folder);
		} else {
			onToggleExpandState();
		}
	};

	return (
		<StyledFolder
			ref={folderRef}
			onContextMenu={onShowContextMenu}
			onClick={(e) => {
				if (isFocused) {
					e.stopPropagation();
					folderRef.current?.focus();
					setIsFocusing(true);
				}
			}}
			$isRoot={isRoot}
			$isOver={isOver}
			$isFocusedOnFolder={isFocusedOnFolder}
			$isFocusedOnFile={isFocusedFileInFolder}
		>
			<FolderLeftSection onClick={onClickFolderName}>
				{!isRoot && !hideExpandIcon && (
					<FolderExpandIcon
						folder={folder}
						isFocused={isFocusedOnFolder || isOver}
					/>
				)}
				{showFolderIcon && (
					<StyledFolderIcon
						$isRoot={isRoot}
						$isFocused={isFocusedOnFolder || isOver}
					/>
				)}
				{renderFolderName()}
			</FolderLeftSection>
			<FilesCount
				folder={folder}
				isFocused={isFocusedOnFolder || isOver}
			/>
		</StyledFolder>
	);
};

export default FolderContent;
