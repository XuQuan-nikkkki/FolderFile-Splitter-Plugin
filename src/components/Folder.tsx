import { Menu, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FolderIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
} from "src/hooks/useSettingsHandler";
import useRenderFolderName from "../hooks/useRenderFolderName";
import FilesCount from "./FilesCount";
import FolderExpandIcon from "./FolderExpandIcon";

const StyledFolder = styled.div<{
	$isRoot?: boolean;
	$isFocusedOnFolder?: boolean;
	$isFocusedOnFile?: boolean;
	$isSelected?: boolean;
}>`
	height: 30px;
	font-size: ${({ $isRoot }) => ($isRoot ? "14px" : "13px")};
	font-weight: ${({ $isRoot }) => ($isRoot ? 450 : undefined)};
	width: 100%;

	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 6px;
	padding-right: 6px;
	border-radius: var(--ffs-border-radius);

	color: var(--text-muted);
	background-color: ${({
		$isFocusedOnFolder,
		$isFocusedOnFile,
		$isSelected,
	}) => {
		if ($isSelected) return "var(--interactive-accent)"
		if ($isFocusedOnFile) return "var(--interactive-hover)";
		if ($isFocusedOnFolder)
			return "var(--interactive-accent)";
		return undefined;
	}} !important;

	&:hover {
		background-color: var(--interactive-hover);
	}
`;

const StyledFolderIcon = styled(FolderIcon)<{
	$isRoot?: boolean;
	$isFocused?: boolean;
	$isSelected?: boolean;
}>`
	fill: ${({ $isFocused, $isSelected }) =>
		$isFocused || $isSelected ? "var(--text-on-accent)" : "#d19600"};
	width: ${({ $isRoot }) => ($isRoot ? "16px" : "14px")};
	height: ${({ $isRoot }) => ($isRoot ? "14px" : "12px")};
	margin-right: var(--size-4-2);
`;

const FolderLeftSection = styled.div`
	display: flex;
	align-items: center;
	flex: 1;
	overflow: hidden;
`;

export type FolderProps = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	onToggleExpandState: () => void;
	isSelected: boolean;
	isRoot?: boolean;
	hideExpandIcon?: boolean;
};
const Folder = ({
	folder,
	useFileTreeStore,
	plugin,
	onToggleExpandState,
	isSelected,
	isRoot = false,
	hideExpandIcon = false,
}: FolderProps) => {
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
			isFocused: isFocusedOnFolder || isSelected,
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
				const modal = new FolderListModal(plugin, folders, folder);
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
			$isFocusedOnFolder={isFocusedOnFolder}
			$isFocusedOnFile={isFocusedFileInFolder}
			$isSelected={isSelected}
		>
			<FolderLeftSection onClick={onClickFolderName}>
				{!isRoot && !hideExpandIcon && (
					<FolderExpandIcon
						folder={folder}
						useFileTreeStore={useFileTreeStore}
						plugin={plugin}
						isFocused={isFocusedOnFolder}
						isSelected={isSelected}
					/>
				)}
				{showFolderIcon && (
					<StyledFolderIcon
						$isRoot={isRoot}
						$isFocused={isFocusedOnFolder}
						$isSelected={isSelected}
					/>
				)}
				{renderFolderName()}
			</FolderLeftSection>
			<FilesCount
				folder={folder}
				useFileTreeStore={useFileTreeStore}
				plugin={plugin}
				isFocused={isFocusedOnFolder}
				isSelected={isSelected}
			/>
		</StyledFolder>
	);
};

export default Folder;
