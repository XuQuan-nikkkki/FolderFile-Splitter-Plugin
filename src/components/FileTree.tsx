import {
	createContext,
	useEffect,
	useMemo,
	useState,
	useContext,
	useRef,
} from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import styled from "styled-components";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { createFileTreeStore, FileTreeStore } from "src/store";
import {
	FFS_FOLDER_PANE_HEIGHT_KEY,
	FFS_FOLDER_PANE_WIDTH_KEY,
} from "src/assets/constants";
import DraggableDivider, { Direction } from "./DraggableDivider";
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
import { useLayoutMode } from "src/hooks/useSettingsHandler";
import {
	HorizontalSplitLayout,
	ToggleViewLayout,
	VerticalSplitLayout,
} from "src/settings";
import {
	HorizontalSplitContainer,
	VerticalSplitContainer,
} from "./Styled/Layout";
import { FilesPane, FoldersPane } from "./Styled/Layout";

const Acitions = styled.div`
	width: 100%;
	margin-bottom: 8px;
	padding: 8px 16px;
	border-radius: var(--ffs-border-radius);
	background-color: var(--interactive-normal);
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const AcitionsSection = styled.div`
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

	const { layoutMode } = useLayoutMode(plugin.settings.layoutMode);

	const [folderPaneWidth, setFolderPaneWidth] = useState<
		number | undefined
	>();
	const [folderPaneHeight, setFolderPaneHeight] = useState<
		number | undefined
	>();
	const [isRestoring, setIsRestoring] = useState<boolean>(true);

	const pluginRef = useRef<HTMLDivElement>(null);

	const restoreLayout = () => {
		try {
			const previousWidthStr = localStorage.getItem(
				FFS_FOLDER_PANE_WIDTH_KEY
			);
			const previousHeightStr = localStorage.getItem(
				FFS_FOLDER_PANE_HEIGHT_KEY
			);
			if (previousWidthStr) {
				const previousWidth = Number(previousWidthStr);
				if (previousWidth) {
					setFolderPaneWidth(previousWidth);
				}
			}
			if (previousHeightStr) {
				const previousHeight = Number(previousHeightStr);
				if (previousHeight) {
					setFolderPaneHeight(previousHeight);
				}
			}
		} catch (e) {
			const pluginWidth = pluginRef.current?.offsetWidth;
			const pluginHeight = pluginRef.current?.offsetHeight;
			if (pluginWidth) {
				const folderPaneWidth = pluginWidth / 2;
				setFolderPaneWidth(folderPaneWidth);
				localStorage.setItem(
					FFS_FOLDER_PANE_WIDTH_KEY,
					String(folderPaneWidth)
				);
			}
			if (pluginHeight) {
				const folderPaneHeight = pluginHeight / 2;
				setFolderPaneHeight(folderPaneHeight);
				localStorage.setItem(
					FFS_FOLDER_PANE_HEIGHT_KEY,
					String(folderPaneHeight)
				);
			}
		}
	};

	useEffect(() => {
		restoreData().then(() => setIsRestoring(false));
		restoreLayout();
	}, []);

	const onChangeFolderPaneWidth = (width: number) => {
		setFolderPaneWidth(width);
		localStorage.setItem(FFS_FOLDER_PANE_WIDTH_KEY, String(width));
	};

	const onChangeFolderPaneHeight = (height: number) => {
		setFolderPaneHeight(height);
		localStorage.setItem(FFS_FOLDER_PANE_HEIGHT_KEY, String(height));
	};

	const renderFoldersPane = () => (
		<>
			<Acitions>
				<AcitionsSection>
					<CreateFolder />
					<SortFolders />
					<ToggleFolders />
				</AcitionsSection>
			</Acitions>
			<Folders />
		</>
	);

	const renderFilesPane = () => (
		<>
			<Acitions>
				<AcitionsSection>
					<CreateFile />
					<SortFiles />
				</AcitionsSection>
			</Acitions>
			<Files />
		</>
	);

	const renderDivider = (direction: Direction) => (
		<DraggableDivider
			direction={direction}
			initialWidth={folderPaneWidth}
			initialHeight={folderPaneHeight}
			onChangeWidth={onChangeFolderPaneWidth}
			onChangeHeight={onChangeFolderPaneHeight}
		/>
	);

	const renderContent = () => {
		switch (layoutMode) {
			case HorizontalSplitLayout:
				return (
					<HorizontalSplitContainer ref={pluginRef}>
						<FoldersPane style={{ width: folderPaneWidth }}>
							{renderFoldersPane()}
						</FoldersPane>
						{renderDivider("horizontal")}
						<FilesPane>{renderFilesPane()}</FilesPane>
					</HorizontalSplitContainer>
				);
			case VerticalSplitLayout:
				return (
					<VerticalSplitContainer ref={pluginRef}>
						<FoldersPane style={{ height: folderPaneHeight }}>
							{renderFoldersPane()}
						</FoldersPane>
						{renderDivider("vertical")}
						<FilesPane>{renderFilesPane()}</FilesPane>
					</VerticalSplitContainer>
				);
			case ToggleViewLayout:
				return "toggle";
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
