import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

import { FFS_FOLDER_PANE_HEIGHT_KEY } from "src/assets/constants";
import { ChevronDown, ChevronRight } from "src/assets/icons";
import { VerticalDraggableDivider } from "./DraggableDivider";
import { FileActionSection, FolderActionSection } from "./Actions";
import FileTree from "../FileTree";
import FolderTree from "../FolderTree";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";

const VerticalSplitLayout = () => {
	const [folderPaneHeight, setFolderPaneHeight] = useState<
		number | undefined
	>();

	const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
	const [isFilesCollapsed, setIsFilesCollapsed] = useState(false);

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf();

	const restoreLayout = () => {
		try {
			const previousHeightStr = localStorage.getItem(
				FFS_FOLDER_PANE_HEIGHT_KEY
			);
			if (previousHeightStr) {
				const previousHeight = Number(previousHeightStr);
				if (previousHeight) {
					setFolderPaneHeight(previousHeight);
				}
			}
		} catch (e) {
			const pluginHeight = pluginRef.current?.offsetHeight;
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
		restoreLayout();
	}, []);

	const onChangeFolderPaneHeight = (height: number) => {
		setFolderPaneHeight(height);
		localStorage.setItem(FFS_FOLDER_PANE_HEIGHT_KEY, String(height));
	};

	const renderIcon = (isCollapsed: boolean, caller: () => void) => (
		<div
			className={classNames(
				"ffs__action-button-wrapper clickable-icon nav-action-button collapse-icon",
				{ "is-collapsed": isCollapsed }
			)}
			onClick={caller}
		>
			<ChevronRight className="ffs__action-button svg-icon" />
		</div>
	);

	const renderOpenPaneButton = (onOpen: () => void) =>
		renderIcon(true, onOpen);

	const renderClosePaneButton = (onClose: () => void) =>
		renderIcon(false, onClose);

	const renderFoldersPane = () => {
		const onOpenPane = () => setIsFoldersCollapsed(false);
		const onClosePane = () => setIsFoldersCollapsed(true);
		if (isFoldersCollapsed) {
			return (
				<div className="ffs__actions-container nav-header">
					<div className="ffs__actions-section ffs__collapsed-folders nav-buttons-container">
						Folders
					</div>
					<div className="ffs__actions-section nav-buttons-container">
						{renderOpenPaneButton(onOpenPane)}
					</div>
				</div>
			);
		}
		return (
			<div
				className="ffs__layout-pane ffs__folders-pane--vertical"
				style={{
					height: isFilesCollapsed ? "100%" : folderPaneHeight,
				}}
			>
				<div className="ffs__actions-container nav-header">
					<FolderActionSection />
					<div className="ffs__actions-section nav-buttons-container">
						{renderClosePaneButton(onClosePane)}
					</div>
				</div>
				<FolderTree />
			</div>
		);
	};

	const renderFilesPane = () => {
		const onOpenPane = () => setIsFilesCollapsed(false);
		const onClosePane = () => setIsFilesCollapsed(true);
		if (isFilesCollapsed) {
			return (
				<div className="ffs__actions-container nav-header">
					<div className="ffs__actions-section ffs__collapsed-files nav-buttons-container">
						Files
					</div>
					<div className="ffs__actions-section nav-buttons-container">
						{renderOpenPaneButton(onOpenPane)}
					</div>
				</div>
			);
		}
		return (
			<div className="ffs__layout-pane ffs__files-pane--vertical">
				<div className="ffs__actions-container nav-header">
					<FileActionSection />
					<div className="ffs__actions-section nav-buttons-container">
						{renderClosePaneButton(onClosePane)}
					</div>
				</div>
				<FileTree />
			</div>
		);
	};

	return (
		<div className="ffs__layout ffs__layout--vertical" ref={pluginRef}>
			{renderFoldersPane()}
			{!isFilesCollapsed && !isFoldersCollapsed && (
				<VerticalDraggableDivider
					initialHeight={folderPaneHeight}
					onChangeHeight={onChangeFolderPaneHeight}
				/>
			)}
			{renderFilesPane()}
		</div>
	);
};

export default VerticalSplitLayout;
