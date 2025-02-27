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
import CollapseFoldersPane from "./FolderActions/CollapseFoldersPane";
import OpenFilesPane from "./FileActions/OpenFilesPane";

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
	const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);

	const onChangeFolderPaneWidth = (width: number) => {
		setFolderPaneWidth(width);
		localStorage.setItem(FFS_FOLDER_PANE_WIDTH_KEY, String(width));
	};

	return (
		<div className="ffs-plugin-container">
			{!isFoldersCollapsed && (
				<>
					<div
						className="ffs-folder-pane"
						style={{ width: folderPaneWidth }}
					>
						<div className="ffs-actions">
							<div className="ffs-actions-left-section">
								<CreateFolder
									useFileTreeStore={useFileTreeStore}
								/>
								<SortFolders
									useFileTreeStore={useFileTreeStore}
									plugin={plugin}
								/>
								<ToggleFolders
									useFileTreeStore={useFileTreeStore}
								/>
							</div>
							<div className="ffs-actions-right-section">
								<CollapseFoldersPane
									onCollapseFoldersPane={() =>
										setIsFoldersCollapsed(true)
									}
								/>
							</div>
						</div>
						<Folders
							plugin={plugin}
							useFileTreeStore={useFileTreeStore}
						/>
					</div>
					<DraggableDivider
						initialWidth={folderPaneWidth}
						onChangeWidth={onChangeFolderPaneWidth}
					/>
				</>
			)}
			<div className="ffs-files-pane">
				<div className="ffs-actions">
					<div className="ffs-actions-left-section">
						<CreateFile useFileTreeStore={useFileTreeStore} />
						<SortFiles
							useFileTreeStore={useFileTreeStore}
							plugin={plugin}
						/>
					</div>
					<div className="ffs-actions-right-section">
						{isFoldersCollapsed && (
							<OpenFilesPane
								onOpenFilesPane={() =>
									setIsFoldersCollapsed(false)
								}
							/>
						)}
					</div>
				</div>
				<Files useFileTreeStore={useFileTreeStore} plugin={plugin} />
			</div>
		</div>
	);
};

export default FileTree;
