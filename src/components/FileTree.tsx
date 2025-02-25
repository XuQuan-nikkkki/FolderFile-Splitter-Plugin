import { useMemo, useState } from "react";

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

	return (
		<div className="ffs-plugin-container">
			<div className="ffs-folder-pane" style={{ width: folderPaneWidth }}>
				<div className="ffs-actions ffs-folder-actions">
					<CreateFolder useFileTreeStore={useFileTreeStore} />
					<SortFolders
						useFileTreeStore={useFileTreeStore}
						plugin={plugin}
					/>
					<ToggleFolders useFileTreeStore={useFileTreeStore} />
				</div>
				<Folders plugin={plugin} useFileTreeStore={useFileTreeStore} />
			</div>
			<DraggableDivider
				initialWidth={folderPaneWidth}
				onChangeWidth={onChangeFolderPaneWidth}
			/>
			<div className="ffs-files-pane">
				<div className="ffs-actions ffs-file-actions">
					<CreateFile useFileTreeStore={useFileTreeStore} />
					<SortFiles
						useFileTreeStore={useFileTreeStore}
						plugin={plugin}
					/>
				</div>
				<Files useFileTreeStore={useFileTreeStore} plugin={plugin} />
			</div>
		</div>
	);
};

export default FileTree;
