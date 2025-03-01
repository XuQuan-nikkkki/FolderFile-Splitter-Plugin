import { useMemo, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import FolderFileSplitterPlugin from "src/main";
import { createFileTreeStore } from "src/store";
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

type Props = {
	plugin: FolderFileSplitterPlugin;
};
const FileTree = ({ plugin }: Props) => {
	const useFileTreeStore = useMemo(
		() => createFileTreeStore(plugin),
		[plugin]
	);

	const [folderPaneWidth, setFolderPaneWidth] = useState<number | undefined>(
		220
	);

	const onChangeFolderPaneWidth = (width: number) => {
		setFolderPaneWidth(width);
		localStorage.setItem(FFS_FOLDER_PANE_WIDTH_KEY, String(width));
	};

	const renderFolderActions = () => (
		<div className="ffs-actions ffs-folder-actions">
			<CreateFolder useFileTreeStore={useFileTreeStore} />
			<SortFolders useFileTreeStore={useFileTreeStore} plugin={plugin} />
			<ToggleFolders useFileTreeStore={useFileTreeStore} />
		</div>
	);

	const renderFileActions = () => (
		<div className="ffs-actions ffs-file-actions">
			<CreateFile useFileTreeStore={useFileTreeStore} />
			<SortFiles useFileTreeStore={useFileTreeStore} plugin={plugin} />
		</div>
	);

	return (
		<DndProvider backend={HTML5Backend}>
			<CustomDragLayer />
			<div className="ffs-plugin-container">
				<div
					className="ffs-folder-pane"
					style={{ width: folderPaneWidth }}
				>
					{renderFolderActions()}
					<Folders
						plugin={plugin}
						useFileTreeStore={useFileTreeStore}
					/>
				</div>
				<DraggableDivider
					initialWidth={folderPaneWidth}
					onChangeWidth={onChangeFolderPaneWidth}
				/>
				<div className="ffs-files-pane">
					{renderFileActions()}
					<Files
						useFileTreeStore={useFileTreeStore}
						plugin={plugin}
					/>
				</div>
			</div>
		</DndProvider>
	);
};

export default FileTree;
