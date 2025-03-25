import { createContext, useEffect, useMemo, useState, useContext } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { createFileTreeStore, FileTreeStore } from "src/store";
import CustomDragLayer from "./CustomDragLayer";
import { useShallow } from "zustand/react/shallow";
import Loading from "./Loading";
import { useLayoutMode } from "src/hooks/useSettingsHandler";
import {
	HorizontalSplitLayoutMode,
	ToggleViewLayoutMode,
	VerticalSplitLayoutMode,
} from "src/settings";
import {
	HorizontalSplitLayout,
	VerticalSplitLayout,
	ToggleViewLayout,
} from "./layout";

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

	const { restoreData } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			restoreData: store.restoreData,
		}))
	);

	const { layoutMode } = useLayoutMode(plugin.settings.layoutMode);

	const [isRestoring, setIsRestoring] = useState<boolean>(true);

	useEffect(() => {
		restoreData().then(() => setIsRestoring(false));
	}, []);

	const renderContent = () => {
		switch (layoutMode) {
			case HorizontalSplitLayoutMode:
				return <HorizontalSplitLayout />;
			case VerticalSplitLayoutMode:
				return <VerticalSplitLayout />;
			case ToggleViewLayoutMode:
				return <ToggleViewLayout />;
			default:
				return "unknown layout mode";
		}
	};

	if (isRestoring) return <Loading />;

	return (
		<DndProvider backend={HTML5Backend}>
			<CustomDragLayer />
			<FileTreeContext.Provider value={{ useFileTreeStore, plugin }}>
				{renderContent()}
			</FileTreeContext.Provider>
		</DndProvider>
	);
};

export default FileTree;
