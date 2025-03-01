import { Menu, TFile, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";

import { ArrowDownIcon, ArrowRightIcon, FolderIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
	useIncludeSubfolderFilesCount,
} from "src/hooks/useSettingsHandler";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { moveFileOrFolder } from "src/utils";
import { ReactNode, useEffect, useRef } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

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
		getFilesCountInFolder,
		hasFolderChildren,
		focusedFolder,
		setFocusedFolder,
		expandedFolderPaths,
		changeExpandedFolderPaths,
		createNewFolder,
		createFile,
		folders,
		focusedFile,
		selectFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
			hasFolderChildren: store.hasFolderChildren,
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolderAndSaveInLocalStorage,
			expandedFolderPaths: store.expandedFolderPaths,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			folders: store.folders,
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
		}))
	);

	const folderRef = useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag, preview] = useDrag(() => ({
		type: "FOLDER",
		item: folder,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
			opacity: monitor.isDragging() ? 0.5 : 1,
		}),
	}));

	const [{ isOver }, drop] = useDrop(() => ({
		accept: ["FILE", "FOLDER"],
		drop: async (item: TFolder | TFile) => {
			if (item.path === folder.path) return;
			await moveFileOrFolder(plugin.app.fileManager, item, folder);
			if (item instanceof TFile) {
				if (focusedFolder?.path !== folder.path) {
					setFocusedFolder(folder);
				}
				selectFile(item);
			} else if (item instanceof TFolder) {
				if (!isRoot && !expandedFolderPaths.includes(folder.path)) {
					onToggleExpandState();
				}
				if (focusedFolder?.path !== item.path) {
					setFocusedFolder(item);
				}
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	drag(drop(folderRef));

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);
	const folderName = isRoot ? plugin.app.vault.getName() : folder.name;

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);
	const { includeSubfolderFilesCount } = useIncludeSubfolderFilesCount(
		settings.includeSubfolderFilesCount
	);

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	const getFolderNameClassNames = (isEditing: boolean): string => {
		return (
			"ffs-folder-name" + (isEditing ? " ffs-folder-name-edit-mode" : "")
		);
	};

	const onSaveName = async (name: string) => {
		const newPath = folder.path.replace(folder.name, name);
		await plugin.app.vault.rename(folder, newPath);
	};

	const { renderEditableName, selectFileNameText, onBeginEdit } =
		useRenderEditableName(folderName, onSaveName, getFolderNameClassNames);

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

	const onClickExpandIcon = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "icon") return;
		e.stopPropagation();
		onToggleExpandState();
	};

	const renderFilesCount = () => {
		const filesCount = getFilesCountInFolder(
			folder,
			includeSubfolderFilesCount
		);
		return <span className="ffs-files-count">{filesCount}</span>;
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

	const maybeRenderExpandIcon = () => {
		const isExpanded = isRoot || expandedFolderPaths.includes(folder.path);
		let content: ReactNode;
		if (!hasFolderChildren(folder) || isRoot) {
			content = null;
		} else {
			content = isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />;
		}
		return (
			<span
				className="ffs-folder-arrow-icon-wrapper"
				onClick={onClickExpandIcon}
			>
				{content}
			</span>
		);
	};

	return (
		<div
			ref={folderRef}
			className={getFolderClassName()}
			onClick={() => setFocusedFolder(folder)}
			onContextMenu={onShowContextMenu}
			style={{
				opacity: isDragging ? 0.5 : 1,
			}}
		>
			<div
				className="ffs-folder-pane-left-section"
				onClick={onClickFolder}
			>
				{maybeRenderExpandIcon()}
				{showFolderIcon && <FolderIcon />}
				{renderEditableName()}
			</div>
			{renderFilesCount()}
		</div>
	);
};

export default Folder;
