import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_WIDTH_KEY } from "src/assets/constants";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";

import FileTree from "../FileTree";
import ToggleFolderAndTagMode from "../FolderAndTagActions/ToggleFolderAndTagView";

import {
	ActionsContainer,
	FileActionSection,
	FolderAndTagActionSection,
} from "./Actions";
import FolderAndTagTree from "../FolderAndTagTree";
import { HorizontalDraggableDivider } from "./DraggableDivider";
import ViewModeDisplay from "./ViewModeDisplay";

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
		<div className="ffs__layout ffs__layout--horizontal" ref={pluginRef}>
			<div
				className="ffs__layout-pane ffs__folders-pane--horizontal"
				style={{ width: folderPaneWidth }}
			>
				<ActionsContainer>
					<FolderAndTagActionSection />
					<ToggleFolderAndTagMode />
				</ActionsContainer>
				<FolderAndTagTree />
			</div>
			<HorizontalDraggableDivider
				initialWidth={folderPaneWidth}
				onChangeWidth={onChangeFolderPaneWidth}
			/>
			<div className="ffs__layout-pane ffs__files-pane--horizontal">
				<ActionsContainer>
					<FileActionSection />
				</ActionsContainer>
				<ViewModeDisplay />
				<FileTree />
			</div>
		</div>
	);
};

export default HorizontalSplitLayout;
