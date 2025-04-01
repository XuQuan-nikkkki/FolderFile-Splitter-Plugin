import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_WIDTH_KEY } from "src/assets/constants";
import { HorizontalDraggableDivider } from "./DraggableDivider";
import {
	HorizontalContainer,
	HorizontalFoldersPane,
	HorizontalFilesPane,
} from "./Layout";
import { Actions, BasicFileActions, BasicFolderActions } from "./Actions";
import Folders from "../Folders";
import Files from "../Files";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";

const HorizontalSplitLayout = () => {
	const [folderPaneWidth, setFolderPaneWidth] = useState<
		number | undefined
	>();

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf()

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
		<HorizontalContainer ref={pluginRef}>
			<HorizontalFoldersPane style={{ width: folderPaneWidth }}>
				<Actions>
					<BasicFolderActions />
				</Actions>
				<Folders />
			</HorizontalFoldersPane>
			<HorizontalDraggableDivider
				initialWidth={folderPaneWidth}
				onChangeWidth={onChangeFolderPaneWidth}
			/>
			<HorizontalFilesPane>
				<Actions>
					<BasicFileActions />
				</Actions>
				<Files />
			</HorizontalFilesPane>
		</HorizontalContainer>
	);
};

export default HorizontalSplitLayout;
