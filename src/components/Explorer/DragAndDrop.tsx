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
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { TAbstractFile, TFile, TFolder } from "obsidian";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useOpenDestinationFolder } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { isFile, isFolder } from "src/utils";

import ExplorerContent from "./Content";

const DragAndDropExplorer = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const {
		isFolderExpanded,
		moveFile,
		moveFolder,
		expandFolder,
		changeFocusedFolder,
		selectFileAndOpen,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			isFolderExpanded: store.isFolderExpanded,
			moveFile: store.moveFile,
			moveFolder: store.moveFolder,
			expandFolder: store.expandFolder,
			changeFocusedFolder: store.changeFocusedFolder,
			selectFileAndOpen: store.selectFileAndOpen,
		}))
	);

	const { openDestinationFolder } = useOpenDestinationFolder(
		settings.openDestinationFolderAfterMove
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

	const isMovingIlleagal = (
		folder: TFolder,
		item: TAbstractFile
	): boolean => {
		const isMovingToSameFolder = folder.path === item.parent?.path;
		const isMovingIntoItself = folder.path === item?.path;
		return isMovingToSameFolder || isMovingIntoItself;
	};

	const onMoveFile = async (
		file: TFile,
		targetFolder: TFolder
	): Promise<void> => {
		const newPath = targetFolder.path + "/" + file.name;
		await moveFile(file, newPath);
		if (openDestinationFolder) {
			await changeFocusedFolder(targetFolder);
			selectFileAndOpen(file);
		}
	};

	const onMoveFolder = async (
		folder: TFolder,
		targetFolder: TFolder
	): Promise<void> => {
		const newPath = targetFolder.path + "/" + folder.name;
		await moveFolder(folder, newPath);
		if (openDestinationFolder) {
			await changeFocusedFolder(targetFolder);
		}
	};

	const expandTargetFolder = (targetFolder: TFolder) => {
		if (isFolderExpanded(targetFolder)) return;
		expandFolder(targetFolder);
	};

	const onDragEnd = async (e: DragEndEvent) => {
		const { active, over } = e;

		const targetFolder = over?.data.current?.item as TFolder | undefined;
		const item = active.data.current?.item as TAbstractFile;

		if (!targetFolder || isMovingIlleagal(targetFolder, item)) return;

		if (isFile(item)) {
			await onMoveFile(item, targetFolder);
		} else if (isFolder(item)) {
			await onMoveFolder(item, targetFolder);
		}
		expandTargetFolder(targetFolder);
		onClearActiveItem();
	};

	const onClearActiveItem = () => {
		setActiveItem(null);
	};

	const maybeRenderOverlayContent = () => {
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
			onDragCancel={onClearActiveItem}
		>
			<ExplorerContent />
			<DragOverlay modifiers={[snapCenterToCursor]}>
				{maybeRenderOverlayContent()}
			</DragOverlay>
		</DndContext>
	);
};

export default DragAndDropExplorer;
