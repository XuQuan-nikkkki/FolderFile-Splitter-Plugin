import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

import { FFS_FOLDER_PANE_WIDTH_KEY } from "src/assets/constants";
import { HorizontalDraggableDivider } from "./DraggableDivider";
import { FileActionSection, FolderActionSection } from "./Actions";
import FolderTree from "../FolderTree";
import FileTree from "../FileTree";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";
import { useHighlightActionBar } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";

const HorizontalSplitLayout = () => {
	const { plugin } = useExplorer();

	const [folderPaneWidth, setFolderPaneWidth] = useState<
		number | undefined
	>();

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf();

	const { highlightActionBar } = useHighlightActionBar(
		plugin.settings.highlightActionBar
	);

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

	const getActionsContainerClassName = () =>
		classNames("ffs__actions-container nav-header", {
			"ffs__actions-container--highlight": highlightActionBar,
		});

	return (
		<div className="ffs__layout ffs__layout--horizontal" ref={pluginRef}>
			<div
				className="ffs__layout-pane ffs__folders-pane--horizontal"
				style={{ width: folderPaneWidth }}
			>
				<div className={getActionsContainerClassName()}>
					<FolderActionSection />
				</div>
				<FolderTree />
			</div>
			<HorizontalDraggableDivider
				initialWidth={folderPaneWidth}
				onChangeWidth={onChangeFolderPaneWidth}
			/>
			<div className="ffs__layout-pane ffs__files-pane--horizontal">
				<div className={getActionsContainerClassName()}>
					<FileActionSection />
				</div>
				<FileTree />
			</div>
		</div>
	);
};

export default HorizontalSplitLayout;
