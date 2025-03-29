import { TFile, TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import styled from "styled-components";
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

import { FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import FileToSort from "./FileToSort";
import { StyledList, StyledPanel } from "../Styled/ManualSortModal";

type Props = {
	parentFolder: TFolder | null;
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const ManualSortFiles = ({ parentFolder, useFileTreeStore, plugin }: Props) => {
	const { getFilesInFolder, sortFiles, fileSortRule, changeOrder } =
		useFileTreeStore(
			useShallow((store: FileTreeStore) => ({
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
			<div style={{ opacity: 0.8, transform: "scale(1.05)" }}>
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
			<StyledPanel>
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					<StyledList>
						{getSortedFiles().map((file) => (
							<FileToSort key={file.path} file={file} />
						))}
					</StyledList>
				</SortableContext>
			</StyledPanel>
			<DragOverlay>{renderOverlayContent()}</DragOverlay>
		</DndContext>
	);
};

export default ManualSortFiles;
