import { useState } from "react";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	pointerWithin,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { TAbstractFile, TFolder } from "obsidian";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useOpenDestinationFolder } from "src/hooks/useSettingsHandler";
import { isFile, isFolder } from "src/utils";
import { useExplorer } from "src/hooks/useExplorer";

import ExplorerContent from "./Content";

const DragAndDropExplorer = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		expandedFolderPaths,
		moveFile,
		moveFolder,
		expandFolder,
		setFocusedFolder,
		selectFile,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			expandedFolderPaths: store.expandedFolderPaths,
			moveFile: store.moveFile,
			moveFolder: store.moveFolder,
			expandFolder: store.expandFolder,
			setFocusedFolder: store.setFocusedFolder,
			selectFile: store.selectFile,
		}))
	);

	const { openDestinationFolderAfterMove } = plugin.settings;
	const { openDestinationFolder } = useOpenDestinationFolder(
		openDestinationFolderAfterMove
	);

	const [activeItem, setActiveItem] = useState<TAbstractFile | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const onDragStart = (e: DragStartEvent) => {
		setActiveItem(e.active.data.current?.item);
	};

	const onDragEnd = async (e: DragEndEvent) => {
		const { active, over } = e;
		if (!over?.data.current) return;
		const { item } = active.data.current as {
			type: string;
			item: TAbstractFile;
		};
		const targetFolder = over?.data.current?.item as TFolder | undefined;
		if (
			!targetFolder ||
			targetFolder.path === item.parent?.path ||
			targetFolder.path === item?.path
		)
			return;
		const newPath = targetFolder.path + "/" + item.name;
		if (isFile(item)) {
			await moveFile(item, newPath);
			if (openDestinationFolder) {
				await setFocusedFolder(targetFolder);
				await selectFile(item);
			}
		} else if (isFolder(item)) {
			await moveFolder(item, newPath);
			if (openDestinationFolder) {
				await setFocusedFolder(item);
			}
		}
		if (!expandedFolderPaths.includes(targetFolder.path)) {
			expandFolder(targetFolder);
		}
		setActiveItem(null);
	};

	const onDragCancel = () => {
		setActiveItem(null);
	};

	const renderOverlayContent = () => {
		if (!activeItem) return null;
		return (
			<div className="ffs__drag-overlay">
				{isFile(activeItem) ? "📄" : "📁"}
			</div>
		);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onDragCancel={onDragCancel}
		>
			<ExplorerContent />
			<DragOverlay modifiers={[snapCenterToCursor]}>
				{renderOverlayContent()}
			</DragOverlay>
		</DndContext>
	);
};

export default DragAndDropExplorer;
