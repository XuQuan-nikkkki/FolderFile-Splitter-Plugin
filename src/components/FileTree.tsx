import { createContext, useEffect, useMemo, useState, useContext } from "react";
import { StoreApi, UseBoundStore } from "zustand";
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

import FolderFileSplitterPlugin from "src/main";
import { createFileTreeStore, FileTreeStore } from "src/store";
import { useShallow } from "zustand/react/shallow";
import Loading from "./Loading";
import {
	useLayoutMode,
	useOpenDestinationFolder,
} from "src/hooks/useSettingsHandler";
import {
	HorizontalSplitLayoutMode,
	VerticalSplitLayoutMode,
} from "src/settings";
import {
	HorizontalSplitLayout,
	VerticalSplitLayout,
} from "./layout";
import { isFile, isFolder } from "src/utils";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

type FileTreeContextType = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const FileTreeContext = createContext<FileTreeContextType | null>(null);

export const useFileTree = () => {
	const context = useContext(FileTreeContext);
	if (!context) {
		throw new Error("useFileTree must be used within a FileTreeProvider");
	}
	return context;
};

type Props = {
	plugin: FolderFileSplitterPlugin;
};
const FileTree = ({ plugin }: Props) => {
	const useFileTreeStore = useMemo(
		() => createFileTreeStore(plugin),
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
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
			<FileTreeContext.Provider value={{ useFileTreeStore, plugin }}>
				{renderContent()}
			</FileTreeContext.Provider>
			<DragOverlay modifiers={[snapCenterToCursor]}>
				{renderOverlayContent()}
			</DragOverlay>
		</DndContext>
	);
};

export default FileTree;
