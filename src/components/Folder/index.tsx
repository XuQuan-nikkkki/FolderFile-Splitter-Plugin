import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { ExplorerStore } from "src/store";
import { FFS_DRAG_FILE, FFS_DRAG_FOLDER } from "src/assets/constants";
import FolderContent, { FolderProps } from "./Content";
import { useExplorer } from "src/hooks/useExplorer";
import FolderExpandIcon from "./ExpandIcon";
import classNames from "classnames";

type Props = FolderProps & {
	onOpenFilesPane: () => void;
	disableDrag?: boolean;
	hideExpandIcon?: boolean;
};
const Folder = ({
	folder,
	onOpenFilesPane,
	hideExpandIcon = false,
	disableDrag = false,
}: Props) => {
	const { useExplorerStore } = useExplorer();

	const {
		setFocusedFolder,
		expandFolder,
		collapseFolder,
		expandedFolderPaths,
		focusedFile,
		focusedFolder,
		hasFolderChildren,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			setFocusedFolder: store.setFocusedFolder,
			hasFolderChildren: store.hasFolderChildren,
			expandedFolderPaths: store.expandedFolderPaths,
			expandFolder: store.expandFolder,
			collapseFolder: store.collapseFolder,
			focusedFile: store.focusedFile,
			focusedFolder: store.focusedFolder,
		}))
	);

	const {
		setNodeRef: setDragRef,
		attributes,
		listeners,
		isDragging,
	} = useDraggable({
		id: folder.path,
		data: { type: FFS_DRAG_FOLDER, item: folder },
	});

	const { setNodeRef: setDropRef, isOver } = useDroppable({
		id: `drop-${folder.path}`,
		data: {
			accepts: [FFS_DRAG_FILE, FFS_DRAG_FOLDER],
			item: folder,
		},
		disabled: disableDrag,
	});

	useEffect(() => {
		if (!isOver) return;
		const timer = setTimeout(() => {
			if (!expandedFolderPaths.includes(folder.path)) {
				expandFolder(folder);
			}
		}, 800);
		return () => clearTimeout(timer);
	}, [isOver]);

	useEffect(() => {
		window.addEventListener("dblclick", onOpenFilesPane);
		return () => {
			window.removeEventListener("dblclick", onOpenFilesPane);
		};
	}, [onOpenFilesPane]);

	const onToggleExpandState = (): void => {
		const isFolderExpanded = expandedFolderPaths.includes(folder.path);
		if (isFolderExpanded) {
			collapseFolder(folder);
		} else {
			expandFolder(folder);
		}
	};

	const maybeRenderExpandIcon = () => {
		const isFocused = folder.path == focusedFolder?.path;
		const isFocusedFileInFolder = focusedFile?.parent?.path === folder.path;
		const isFocusedOnFile =
			isFocused && focusedFile && isFocusedFileInFolder;
		const isFocusedOnFolder = isFocused && !isFocusedOnFile;

		if (folder.isRoot() || hideExpandIcon) return null;
		return (
			<FolderExpandIcon
				folder={folder}
				isFocused={isFocusedOnFolder || isOver}
			/>
		);
	};

	return (
		<div
			className={classNames(
				"ffs__folder-container tree-item-self nav-folder-title is-clickable",
				{ "mod-collapsible": hasFolderChildren(folder) }
			)}
			ref={setDropRef}
		>
			{maybeRenderExpandIcon()}
			<div
				className="ffs__draggable-container tree-item-inner nav-folder-title-content"
				style={{ opacity: isDragging ? 0 : 1 }}
				ref={setDragRef}
				onClick={() => setFocusedFolder(folder)}
				{...attributes}
				{...listeners}
			>
				<FolderContent
					folder={folder}
					isOver={isOver}
					onToggleExpandState={onToggleExpandState}
				/>
			</div>
		</div>
	);
};

export default Folder;
