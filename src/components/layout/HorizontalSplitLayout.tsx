import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_WIDTH_KEY } from "src/assets/constants";
import { HorizontalDraggableDivider } from "./DraggableDivider";
import {
	StyledHorizontalSplitLayout,
	StyledHorizontalFoldersPane,
	StyledHorizontalFilesPane,
} from "./Layout";
import {
	StyledActionsContainer,
	FileActionSection,
	FolderActionSection,
} from "./Actions";
import FolderTree from "../FolderTree";
import FileTree from "../FileTree";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";

const HorizontalSplitLayout = () => {
	const [folderPaneWidth, setFolderPaneWidth] = useState<
		number | undefined
	>();

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf();

	const restoreLayout = () => {
		try {
			const previousWidthStr = localStorage.getItem(
				FFS_FOLDER_PANE_WIDTH_KEY
			);
			if (previousWidthStr) {
				const previousWidth = Number(previousWidthStr);
				if (previousWidth) {
					setFolderPaneWidth(previousWidth);
				}
			}
		} catch (e) {
			const pluginWidth = pluginRef.current?.offsetWidth;
			if (pluginWidth) {
				const folderPaneWidth = pluginWidth / 2;
				setFolderPaneWidth(folderPaneWidth);
				localStorage.setItem(
					FFS_FOLDER_PANE_WIDTH_KEY,
					String(folderPaneWidth)
				);
			}
		}
	};

	useEffect(() => {
		restoreLayout();
	}, []);

	const onChangeFolderPaneWidth = (width: number) => {
		setFolderPaneWidth(width);
		localStorage.setItem(FFS_FOLDER_PANE_WIDTH_KEY, String(width));
	};

	return (
		<StyledHorizontalSplitLayout ref={pluginRef}>
			<StyledHorizontalFoldersPane style={{ width: folderPaneWidth }}>
				<StyledActionsContainer className="ffs__actions-container--folder">
					<FolderActionSection />
				</StyledActionsContainer>
				<FolderTree />
			</StyledHorizontalFoldersPane>
			<HorizontalDraggableDivider
				initialWidth={folderPaneWidth}
				onChangeWidth={onChangeFolderPaneWidth}
			/>
			<StyledHorizontalFilesPane>
				<StyledActionsContainer className="ffs__actions-container--file">
					<FileActionSection />
				</StyledActionsContainer>
				<FileTree />
			</StyledHorizontalFilesPane>
		</StyledHorizontalSplitLayout>
	);
};

export default HorizontalSplitLayout;
