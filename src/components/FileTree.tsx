import { createContext, useEffect, useMemo, useState, useContext } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import styled from "styled-components";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { createFileTreeStore, FileTreeStore } from "src/store";
import { FFS_FOLDER_PANE_WIDTH_KEY } from "src/assets/constants";
import DraggableDivider from "./DraggableDivider";
import Files from "./Files";
import Folders from "./Folders";
import CreateFolder from "./FolderActions/CreateFolder";
import ToggleFolders from "./FolderActions/ToggleFolders";
import SortFolders from "./FolderActions/SortFolders";
import CreateFile from "./FileActions/CreateFile";
import SortFiles from "./FileActions/SortFiles";
import CustomDragLayer from "./CustomDragLayer";
import { useShallow } from "zustand/react/shallow";
import Loading from "./Loading";

export const FOLDERS_PANE_MIN_WIDTH = 140;
export const FILES_PANE_MIN_WIDTH = 200;

const PluginContainer = styled.div`
	display: flex;
	height: 100%;
	overflow-y: hidden;
`;

const FoldersPane = styled.div`
	min-width: ${FOLDERS_PANE_MIN_WIDTH}px;
	display: flex;
	flex-direction: column;
`;

const FilesPane = styled.div`
	min-width: ${FILES_PANE_MIN_WIDTH}px;
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
`;

const Acitions = styled.div`
	width: 100%;
	margin-bottom: 8px;
	padding: 8px 16px;
	border-radius: var(--ffs-border-radius);
	background-color: var(--interactive-normal);
	display: flex;
	align-items: center;
	gap: var(--size-4-3);
`;

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

	const [folderPaneWidth, setFolderPaneWidth] = useState<number | undefined>(
		220
	);
	const [isRestoring, setIsRestoring] = useState<boolean>(true);

	useEffect(() => {
		restoreData().then(() => setIsRestoring(false));
	}, []);

	const onChangeFolderPaneWidth = (width: number) => {
		setFolderPaneWidth(width);
		localStorage.setItem(FFS_FOLDER_PANE_WIDTH_KEY, String(width));
	};

	const renderFolderActions = () => (
		<Acitions>
			<CreateFolder />
			<SortFolders />
			<ToggleFolders />
		</Acitions>
	);

	const renderFileActions = () => (
		<Acitions>
			<CreateFile />
			<SortFiles />
		</Acitions>
	);

	return isRestoring ? (
		<Loading />
	) : (
		<DndProvider backend={HTML5Backend}>
			<CustomDragLayer />
			<FileTreeContext.Provider value={{ useFileTreeStore, plugin }}>
				<PluginContainer>
					<FoldersPane style={{ width: folderPaneWidth }}>
						{renderFolderActions()}
						<Folders />
					</FoldersPane>
					<DraggableDivider
						initialWidth={folderPaneWidth}
						onChangeWidth={onChangeFolderPaneWidth}
					/>
					<FilesPane>
						{renderFileActions()}
						<Files />
					</FilesPane>
				</PluginContainer>
			</FileTreeContext.Provider>
		</DndProvider>
	);
};

export default FileTree;
