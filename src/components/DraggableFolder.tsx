import { TFile, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useDrop } from "react-dnd";
import { useRef } from "react";

import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { isAbstractFileIncluded, moveFileOrFolder } from "src/utils";
import useDraggable, {
	DraggableFiles,
	DraggableFolders,
	DraggableItem,
	getDraggingStyles,
} from "src/hooks/useDraggable";
import {
	FFS_DRAG_FILES_TYPE,
	FFS_DRAG_FOLDERS_TYPE,
} from "src/assets/constants";
import SortableFolder from "./SortableFolder";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	selectedFolders: TFolder[];
	draggingFolders: TFolder[];
	setSelectedFolders: (folders: TFolder[]) => void;
	setDraggingFolders: (folders: TFolder[]) => void;
	isRoot?: boolean;
};
const DraggableFolder = ({
	folder,
	useFileTreeStore,
	plugin,
	selectedFolders,
	draggingFolders,
	setSelectedFolders,
	setDraggingFolders,
	isRoot = false,
}: Props) => {
	const {
		focusedFolder,
		hasFolderChildren,
		setFocusedFolder,
		expandedFolderPaths,
		changeExpandedFolderPaths,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFolder: store.focusedFolder,
			hasFolderChildren: store.hasFolderChildren,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
		}))
	);

	const folderRef = useRef<HTMLDivElement>(null);

	const isFolderSelected = isAbstractFileIncluded(selectedFolders, folder);

	const { drag, isDragging } = useDraggable({
		type: FFS_DRAG_FOLDERS_TYPE,
		item: () => {
			const foldersToDrag = isFolderSelected ? selectedFolders : [folder];
			setDraggingFolders(foldersToDrag);
			return {
				folders: foldersToDrag,
			};
		},
		end: () => setDraggingFolders([]),
		deps: [selectedFolders, draggingFolders],
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

	const onDropFolders = async (folders: TFolder[]) => {
		const foldersToMove = folders.filter((f) => f.path !== folder.path);
		if (!foldersToMove.length) return;
		await Promise.all(
			foldersToMove.map(
				async (f) =>
					await moveFileOrFolder(plugin.app.fileManager, f, folder)
			)
		);
		if (!isRoot && !expandedFolderPaths.includes(folder.path)) {
			onToggleExpandState();
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

	const onToggleExpandState = (): void => {
		if (isRoot) return;
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: [...expandedFolderPaths, folder.path];
			changeExpandedFolderPaths(folderPaths);
		}
	};

	const getFolderClassName = (): string => {
		const folderClassNames = [
			"ffs-draggable-folder",
			isOver && "ffs-drop-target-folder",
		];
		if (isFolderSelected) {
			folderClassNames.push("ffs-selected-folder");
		}
		return folderClassNames.filter(Boolean).join(" ");
	};

	const beginMultiSelect = (): TFolder[] => {
		let newFolders = [...selectedFolders];
		if (
			focusedFolder &&
			!isAbstractFileIncluded(selectedFolders, focusedFolder)
		) {
			newFolders = [...selectedFolders, focusedFolder];
		}
		return newFolders;
	};

	const onSelectOneByOne = () => {
		let folders = beginMultiSelect();
		if (isFolderSelected) {
			folders = folders.filter((f) => f.path !== folder.path);
		} else {
			folders.push(folder);
		}
		setSelectedFolders(folders);
	};

	const onClickFolder = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.altKey || e.metaKey) {
			onSelectOneByOne();
		} else {
			setSelectedFolders([folder]);
			setFocusedFolder(folder);
		}
	};

	const getIsDragging = () =>
		isDragging || isAbstractFileIncluded(draggingFolders, folder);

	return (
		<div
			ref={folderRef}
			className={getFolderClassName()}
			onClick={onClickFolder}
			style={getDraggingStyles(getIsDragging())}
		>
			<SortableFolder
				folder={folder}
				useFileTreeStore={useFileTreeStore}
				plugin={plugin}
				onToggleExpandState={onToggleExpandState}
				isRoot={isRoot}
			/>
		</div>
	);
};

export default DraggableFolder;
