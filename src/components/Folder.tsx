import { Menu, TFile, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useDrop } from "react-dnd";
import { useRef } from "react";

import { FolderIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
} from "src/hooks/useSettingsHandler";
import { moveFileOrFolder } from "src/utils";
import useDraggable, {
	DraggableFiles,
	DraggableFolders,
	DraggableItem,
} from "src/hooks/useDraggable";
import {
	FFS_DRAG_FILES_TYPE,
	FFS_DRAG_FOLDERS_TYPE,
} from "src/assets/constants";
import useRenderFolderName from "../hooks/useRenderFolderName";
import FilesCount from "./FilesCount";
import FolderExpandIcon from "./FolderExpandIcon";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	isRoot?: boolean;
};
const Folder = ({
	folder,
	useFileTreeStore,
	plugin,
	isRoot = false,
}: Props) => {
	const {
		hasFolderChildren,
		focusedFolder,
		setFocusedFolder,
		expandedFolderPaths,
		changeExpandedFolderPaths,
		createNewFolder,
		createFile,
		folders,
		focusedFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			hasFolderChildren: store.hasFolderChildren,
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolderAndSaveInLocalStorage,
			expandedFolderPaths: store.expandedFolderPaths,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			folders: store.folders,
			focusedFile: store.focusedFile,
		}))
	);

	const folderRef = useRef<HTMLDivElement>(null);

	const { drag, draggingStyle } = useDraggable({
		type: FFS_DRAG_FOLDERS_TYPE,
		item: {
			folders: [folder],
		},
	});

	const onDropFiles = async (files: TFile[]) => {
		const filesToMove = files.filter((file) => file.path !== folder.path);
		if (!filesToMove.length) return;
		await Promise.all(
			filesToMove.map(
				async (file) =>
					await moveFileOrFolder(plugin.app.fileManager, file, folder)
			)
		);
		setFocusedFolder(folder);
	};

	const onDropFolders = async (item: TFolder[]) => {
		const droppedFolder = item[0];
		if (droppedFolder.path === folder.path) return;
		await moveFileOrFolder(plugin.app.fileManager, droppedFolder, folder);
		if (!isRoot && !expandedFolderPaths.includes(folder.path)) {
			onToggleExpandState();
		}
		if (focusedFolder?.path !== droppedFolder.path) {
			setFocusedFolder(droppedFolder);
		}
	};

	const [{ isOver }, drop] = useDrop(() => ({
		accept: [FFS_DRAG_FILES_TYPE, FFS_DRAG_FOLDERS_TYPE],
		drop: async (item: DraggableItem, monitor) => {
			const itemType = monitor.getItemType();
			if (itemType === FFS_DRAG_FOLDERS_TYPE) {
				await onDropFolders((item as DraggableFolders).folders);
			} else if (itemType === FFS_DRAG_FILES_TYPE) {
				await onDropFiles((item as DraggableFiles).files);
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	drag(drop(folderRef));

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);

	const { renderFolderName, selectFileNameText, onBeginEdit } =
		useRenderFolderName(folder, plugin, isRoot);

	const onToggleExpandState = (): void => {
		if (isRoot) return;
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: [...expandedFolderPaths, folder.path];
			changeExpandedFolderPaths(folderPaths);
		}
	};

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
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

	const onClickFolder = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "folder") return;

		e.stopPropagation();
		if (focusedFolder?.path !== folder.path) {
			setFocusedFolder(folder);
		} else {
			onToggleExpandState();
		}
	};

	const getFolderClassName = (): string => {
		const isFocused = folder.path == focusedFolder?.path;

		const isFocusedFileInFolder = focusedFile?.parent?.path === folder.path;
		const folderClassNames = [
			"ffs-folder",
			isRoot && "ffs-root-folder",
			isOver && "ffs-drop-target-folder",
		];
		if (isFocused && (!focusedFile || !isFocusedFileInFolder)) {
			folderClassNames.push("ffs-focused-folder");
		} else if (isFocused) {
			folderClassNames.push("ffs-focused-folder-with-focused-file");
		}
		return folderClassNames.filter(Boolean).join(" ");
	};

	return (
		<div
			ref={folderRef}
			className={getFolderClassName()}
			onClick={() => setFocusedFolder(folder)}
			onContextMenu={onShowContextMenu}
			style={draggingStyle}
		>
			<div
				className="ffs-folder-pane-left-section"
				onClick={onClickFolder}
			>
				<FolderExpandIcon
					folder={folder}
					useFileTreeStore={useFileTreeStore}
					plugin={plugin}
					isRoot={isRoot}
				/>
				{showFolderIcon && <FolderIcon />}
				{renderFolderName()}
			</div>
			<FilesCount
				folder={folder}
				useFileTreeStore={useFileTreeStore}
				plugin={plugin}
			/>
		</div>
	);
};

export default Folder;
