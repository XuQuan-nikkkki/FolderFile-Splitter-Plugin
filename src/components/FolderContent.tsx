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
		folders,
		focusedFile,
		pinFolder,
		unpinFolder,
		isFolderPinned,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			folders: store.folders,
			focusedFile: store.focusedFile,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
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
	const { renderFolderName, selectFileNameText, onBeginEdit } =
		useRenderFolderName(folder, plugin, {
			isRoot,
			isFocused: isFocusedOnFolder,
		});

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
			item.onClick(() => {
				createFile(folder);
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
			item.onClick(() => {
				plugin.app.fileManager.trashFile(folder);
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
			onContextMenu={onShowContextMenu}
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
