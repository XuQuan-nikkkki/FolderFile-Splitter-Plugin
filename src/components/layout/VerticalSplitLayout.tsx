import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_HEIGHT_KEY } from "src/assets/constants";
import { VerticalDraggableDivider } from "./DraggableDivider";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";
import { toValidNumber } from "src/utils";
import VerticalSplitFilesPane from "./VerticalSplitFilesPane";
import VerticalSplitFoldersAndTagsPane from "./VerticalSplitFoldersAndTagsPane";

const VerticalSplitLayout = () => {
	const [folderPaneHeight, setFolderPaneHeight] = useState<
		number | undefined
	>();
	const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
	const [isFilesCollapsed, setIsFilesCollapsed] = useState(false);

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf();

	const changeHeightAndSave = (height: number) => {
		setFolderPaneHeight(height);
		localStorage.setItem(FFS_FOLDER_PANE_HEIGHT_KEY, String(height));
	};

	const fallbackToDefaultHeight = () => {
		// The native file explorer uses a single-pane layout,
		// This plugin introduces a two-pane layout.
		// By default, the folder pane takes up half of the plugin height.
		const pluginHeight = pluginRef.current?.offsetHeight;
		if (!pluginHeight) return;
		const defaultHeight = pluginHeight / 2;
		changeHeightAndSave(defaultHeight);
	};

	const restoreLayout = () => {
		const previousHeight = toValidNumber(
			localStorage.getItem(FFS_FOLDER_PANE_HEIGHT_KEY)
		);
		if (previousHeight !== null) {
			setFolderPaneHeight(previousHeight);
		} else {
			fallbackToDefaultHeight();
		}
	};

	useEffect(() => {
		restoreLayout();
	}, []);

	return (
		<div className="ffs__layout ffs__layout--vertical" ref={pluginRef}>
			<VerticalSplitFoldersAndTagsPane
				folderPaneHeight={folderPaneHeight}
				isFoldersCollapsed={isFoldersCollapsed}
				isFilesCollapsed={isFilesCollapsed}
				setIsFoldersCollapsed={setIsFoldersCollapsed}
			/>
			{!isFilesCollapsed && !isFoldersCollapsed && (
				<VerticalDraggableDivider
					initialHeight={folderPaneHeight}
					onChangeHeight={changeHeightAndSave}
				/>
			)}
			<VerticalSplitFilesPane
				isFilesCollapsed={isFilesCollapsed}
				setIsFilesCollapsed={setIsFilesCollapsed}
			/>
		</div>
	);
};

export default VerticalSplitLayout;
