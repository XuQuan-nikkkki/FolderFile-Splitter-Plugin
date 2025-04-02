import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

import { ExplorerStore } from "src/store";
import { FFS_DRAG_FILE, FFS_DRAG_FOLDER } from "src/assets/constants";
import FolderContent, { FolderProps } from "./FolderContent";
import { Draggable } from "./Styled/Sortable";
import { useExplorer } from "./Explorer";
import { useDraggable, useDroppable } from "@dnd-kit/core";

type Props = FolderProps & {
	onOpenFilesPane: () => void;
	disableDrag?: boolean;
};
const Folder = ({
	folder,
	onOpenFilesPane,
	isRoot = false,
	hideExpandIcon = false,
	disableDrag = false,
}: Props) => {
	const { useExplorerStore } = useExplorer();

	const {
		setFocusedFolder,
		expandFolder,
		collapseFolder,
		expandedFolderPaths,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			setFocusedFolder: store.setFocusedFolder,
			hasFolderChildren: store.hasFolderChildren,
			expandedFolderPaths: store.expandedFolderPaths,
			expandFolder: store.expandFolder,
			collapseFolder: store.collapseFolder,
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

	return (
		<div ref={setDropRef}>
			<Draggable
				ref={setDragRef}
				style={{ opacity: isDragging ? 0 : 1 }}
				onClick={() => setFocusedFolder(folder)}
				{...attributes}
				{...listeners}
			>
				<FolderContent
					folder={folder}
					isRoot={isRoot}
					hideExpandIcon={hideExpandIcon}
					isOver={isOver}
					onToggleExpandState={onToggleExpandState}
				/>
			</Draggable>
		</div>
	);
};

export default Folder;
