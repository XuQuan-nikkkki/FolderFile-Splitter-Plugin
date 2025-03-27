import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import styled from "styled-components";
import { Fragment, useEffect, useState } from "react";
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
import FolderToSort, { StyledButton } from "./FolderToSort";

const StyledFoldersList = styled.div`
	overflow-y: auto;
	height: 50vh;

	display: flex;
	flex-direction: column;
	gap: 8px;
`;
const StyledAction = styled.div`
	width: 100%;
	background-color: var(--interactive-normal);
	border-radius: var(--ffs-border-radius);
	padding: 8px 16px;
`;
const StyledPanel = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

type Props = {
	parentFolder: TFolder | null;
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const ManualSort = ({ parentFolder, useFileTreeStore, plugin }: Props) => {
	const {
		getFoldersByParent,
		sortFolders,
		folderSortRule,
		changeFoldersManualOrderAndSave,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			getFoldersByParent: store.getFoldersByParent,
			sortFolders: store.sortFolders,
			folderSortRule: store.folderSortRule,
			order: store.foldersManualSortOrder,
			changeFoldersManualOrderAndSave:
				store.changeFoldersManualOrderAndSave,
		}))
	);

	const [folder, setFolder] = useState<TFolder | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		const targetFolder = parentFolder ?? plugin.app.vault.getRoot();
		setFolder(targetFolder);
	}, []);

	const getSortedFolders = () => {
		if (!folder) return [];
		return sortFolders(getFoldersByParent(folder), folderSortRule, false);
	};

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(String(event.active.id));
	};

	const onDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const folder = getSortedFolders().find((f) => f.path === active.id);
			if (!folder) return;
			const atIndex = getSortedFolders().findIndex(
				(f) => f.path === over.id
			);
			return await changeFoldersManualOrderAndSave(folder, atIndex);
		}
	};

	const goInToFolder = (folder: TFolder | null) => {
		if (!folder) return;
		setFolder(folder);
	};

	const renderSlashSign = () => <span> / </span>;

	const renderBreadcrumbs = () => {
		if (!folder) return null;
		if (folder.isRoot()) {
			return (
				<StyledButton $disabled>
					{plugin.app.vault.getName()}
				</StyledButton>
			);
		}
		const crumbs = folder.path.split("/");
		const rootFolder = plugin.app.vault.getRoot();
		return (
			<>
				<StyledButton onClick={() => goInToFolder(rootFolder)}>
					{plugin.app.vault.getName()}
				</StyledButton>
				{renderSlashSign()}
				{crumbs.map((crumb, index) => {
					const path = crumbs.slice(0, index + 1).join("/");
					const target = plugin.app.vault.getFolderByPath(path);
					return (
						<Fragment key={crumb + index}>
							{index > 0 && renderSlashSign()}
							<StyledButton
								$disabled={index === crumbs.length - 1}
								onClick={() => goInToFolder(target)}
							>
								{crumb}
							</StyledButton>
						</Fragment>
					);
				})}
			</>
		);
	};

	if (!folder) return null;

	const items = getSortedFolders().map((folder) => folder.path);

	const renderOverlayContent = () => {
		if (!activeId) return null;
		const folder = getSortedFolders().find((f) => f.path === activeId);
		if (!folder) return null;
		return (
			<div style={{ opacity: 0.8, transform: "scale(1.05)" }}>
				<FolderToSort
					folder={folder}
					useFileTreeStore={useFileTreeStore}
					goInToFolder={goInToFolder}
				/>
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
				<StyledAction>{renderBreadcrumbs()}</StyledAction>
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					<StyledFoldersList>
						{getSortedFolders().map((folder) => (
							<FolderToSort
								key={folder.path}
								folder={folder}
								useFileTreeStore={useFileTreeStore}
								goInToFolder={goInToFolder}
							/>
						))}
					</StyledFoldersList>
				</SortableContext>
			</StyledPanel>
			<DragOverlay>{renderOverlayContent()}</DragOverlay>
		</DndContext>
	);
};

export default ManualSort;
