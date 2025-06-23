import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_WIDTH_KEY } from "src/assets/constants";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";
import { toValidNumber } from "src/utils";

import FileTree from "../FileTree";
import ToggleFolderAndTagMode from "../FolderAndTagActions/ToggleFolderAndTagView";
import FolderAndTagTree from "../FolderAndTagTree";

import {
	ActionsContainer,
	FileActionSection,
	FolderAndTagActionSection,
} from "./Actions";
import { HorizontalDraggableDivider } from "./DraggableDivider";
import ViewModeDisplay from "./ViewModeDisplay";

const HorizontalSplitLayout = () => {
	const [folderPaneWidth, setFolderPaneWidth] = useState<
		number | undefined
	>();

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf();

	const changeWidthAndSave = (width: number) => {
		setFolderPaneWidth(width);
		localStorage.setItem(FFS_FOLDER_PANE_WIDTH_KEY, String(width));
	};

	const fallbackToDefaultWidth = () => {
		// The native file explorer uses a single-pane layout,
		// This plugin introduces a two-pane layout.
		// By default, the folder pane takes up half of the plugin width.
		const pluginWidth = pluginRef.current?.offsetWidth;
		if (!pluginWidth) return;
		const defaultWidth = pluginWidth / 2;
		changeWidthAndSave(defaultWidth);
	};

	const restoreLayout = () => {
		const previousWidth = toValidNumber(
			localStorage.getItem(FFS_FOLDER_PANE_WIDTH_KEY)
		);
		if (previousWidth !== null) {
			setFolderPaneWidth(previousWidth);
		} else {
			fallbackToDefaultWidth();
		}
	};

	useEffect(() => {
		restoreLayout();
	}, []);

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
				onChangeWidth={changeWidthAndSave}
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
