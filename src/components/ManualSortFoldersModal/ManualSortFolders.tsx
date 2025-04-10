import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
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

import { ExplorerStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import FolderToSort from "./FolderToSort";

type Props = {
	parentFolder: TFolder | null;
	useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>;
	plugin: FolderFileSplitterPlugin;
};
const ManualSortFolders = ({
	parentFolder,
	useExplorerStore,
	plugin,
}: Props) => {
	const {
		getFoldersByParent,
		sortFolders,
		folderSortRule,
		changeFoldersManualOrderAndSave,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
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
			const folder = active.data.current?.item as TFolder;
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

	const getEnterFolderBtnClassName = (disabled?: boolean) =>
		[
			"ffs__enter-folder-button",
			disabled ? "ffs__enter-folder-button--disabled" : "",
		].join(" ");

	const renderBreadcrumbs = () => {
		if (!folder) return null;
		if (folder.isRoot()) {
			return (
				<div className={getEnterFolderBtnClassName(true)}>
					{plugin.app.vault.getName()}
				</div>
			);
		}
		const crumbs = folder.path.split("/");
		const rootFolder = plugin.app.vault.getRoot();
		return (
			<>
				<div
					className={getEnterFolderBtnClassName()}
					onClick={() => goInToFolder(rootFolder)}
				>
					{plugin.app.vault.getName()}
				</div>
				{renderSlashSign()}
				{crumbs.map((crumb, index) => {
					const path = crumbs.slice(0, index + 1).join("/");
					const target = plugin.app.vault.getFolderByPath(path);
					return (
						<Fragment key={crumb + index}>
							{index > 0 && renderSlashSign()}
							<div
								className={getEnterFolderBtnClassName(
									index === crumbs.length - 1
								)}
								onClick={() => goInToFolder(target)}
							>
								{crumb}
							</div>
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
			<div className="ffs__sorting-item-container">
				<FolderToSort
					folder={folder}
					useExplorerStore={useExplorerStore}
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
			<div className="ffs__manual-sort-container">
				<div className="ffs__manual-sort-breadcrumbs">
					{renderBreadcrumbs()}
				</div>
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					<div className="ffs__manual-sort-list">
						{getSortedFolders().map((folder) => (
							<FolderToSort
								key={folder.path}
								folder={folder}
								useExplorerStore={useExplorerStore}
								goInToFolder={goInToFolder}
							/>
						))}
					</div>
				</SortableContext>
			</div>
			<DragOverlay>{renderOverlayContent()}</DragOverlay>
		</DndContext>
	);
};

export default ManualSortFolders;
