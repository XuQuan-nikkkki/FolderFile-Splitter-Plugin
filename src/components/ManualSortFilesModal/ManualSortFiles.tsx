import { TFile, TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import { useState } from "react";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

import { ExplorerStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import FileToSort from "./FileToSort";

type Props = {
	parentFolder: TFolder | null;
	useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>;
	plugin: FolderFileSplitterPlugin;
};
const ManualSortFiles = ({ parentFolder, useExplorerStore, plugin }: Props) => {
	const { getFilesInFolder, sortFiles, fileSortRule, changeOrder } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				order: store.filesManualSortOrder,
				getFilesInFolder: store.getFilesInFolder,
				sortFiles: store.sortFiles,
				fileSortRule: store.fileSortRule,
				changeOrder: store.changeFilesManualOrderAndSave,
			}))
		);

	const [activeFile, setActiveFile] = useState<TFile | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const getSortedFiles = () => {
		if (!parentFolder) return [];
		const files = getFilesInFolder(parentFolder);
		return sortFiles(files, fileSortRule);
	};

	const onDragStart = (event: DragStartEvent) => {
		setActiveFile(event.active.data.current?.item as TFile);
	};

	const onDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			if (!activeFile) return;
			const atIndex = getSortedFiles().findIndex(
				(f) => f.path === over.id
			);
			return await changeOrder(activeFile, atIndex);
		}
	};

	if (!parentFolder) return null;

	const items = getSortedFiles().map((folder) => folder.path);

	const renderOverlayContent = () => {
		if (!activeFile) return null;
		return (
			<div className="ffs__sorting-item-container">
				<FileToSort file={activeFile} />
			</div>
		);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<div className="ffs__manual-sort-container">
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					<div className="ffs__manual-sort-list">
						{getSortedFiles().map((file) => (
							<FileToSort key={file.path} file={file} />
						))}
					</div>
				</SortableContext>
			</div>
			<DragOverlay>{renderOverlayContent()}</DragOverlay>
		</DndContext>
	);
};

export default ManualSortFiles;
