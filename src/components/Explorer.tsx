import { useEffect, useMemo, useState } from "react";
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

import FolderFileSplitterPlugin from "src/main";
import { createExplorerStore, ExplorerStore } from "src/store";
import {
	useLayoutMode,
	useOpenDestinationFolder,
} from "src/hooks/useSettingsHandler";
import {
	HorizontalSplitLayoutMode,
	VerticalSplitLayoutMode,
} from "src/settings";
import { isFile, isFolder } from "src/utils";
import { ExplorerContext } from "src/hooks/useExplorer";

import { HorizontalSplitLayout, VerticalSplitLayout } from "./layout";
import Loading from "./Loading";

type Props = {
	plugin: FolderFileSplitterPlugin;
};
const Explorer = ({ plugin }: Props) => {
	const useExplorerStore = useMemo(
		() => createExplorerStore(plugin),
		[plugin]
	);

	const {
		restoreData,
		expandedFolderPaths,
		moveFile,
		moveFolder,
		expandFolder,
		setFocusedFolder,
		selectFile,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			restoreData: store.restoreData,
			expandedFolderPaths: store.expandedFolderPaths,
			moveFile: store.moveFile,
			moveFolder: store.moveFolder,
			expandFolder: store.expandFolder,
			setFocusedFolder: store.setFocusedFolder,
			selectFile: store.selectFile,
		}))
	);

	const { layoutMode: defaultLayout, openDestinationFolderAfterMove } =
		plugin.settings;
	const { layoutMode } = useLayoutMode(defaultLayout);
	const { openDestinationFolder } = useOpenDestinationFolder(
		openDestinationFolderAfterMove
	);

	const [isRestoring, setIsRestoring] = useState<boolean>(true);
	const [activeItem, setActiveItem] = useState<TAbstractFile | null>(null);

	useEffect(() => {
		restoreData().then(() => setIsRestoring(false));
	}, []);

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

	const renderContent = () => {
		switch (layoutMode) {
			case HorizontalSplitLayoutMode:
				return <HorizontalSplitLayout />;
			case VerticalSplitLayoutMode:
				return <VerticalSplitLayout />;
			default:
				return "unknown layout mode";
		}
	};

	if (isRestoring) return <Loading />;

	const renderOverlayContent = () => {
		if (!activeItem) return null;
		return (
			<div
				style={{
					position: "absolute",
					pointerEvents: "none",
					fontSize: "24px",
					transform: "translate(-50%, -50%)",
					zIndex: 100,
				}}
			>
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
			<ExplorerContext.Provider value={{ useExplorerStore, plugin }}>
				{renderContent()}
			</ExplorerContext.Provider>
			<DragOverlay modifiers={[snapCenterToCursor]}>
				{renderOverlayContent()}
			</DragOverlay>
		</DndContext>
	);
};

export default Explorer;
