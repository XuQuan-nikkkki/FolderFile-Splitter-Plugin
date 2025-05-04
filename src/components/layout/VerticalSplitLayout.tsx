import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

import { FFS_FOLDER_PANE_HEIGHT_KEY } from "src/assets/constants";
import { ChevronRight } from "src/assets/icons";
import { VerticalDraggableDivider } from "./DraggableDivider";
import { FileActionSection, FolderAndTagActionSection } from "./Actions";
import FileTree from "../FileTree";
import FolderAndTagTree from "../FolderAndTagTree";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useAutoHideActionBar,
	useHighlightActionBar,
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import ToggleFolderAndTagMode from "../FolderAndTagActions/ToggleFolderAndTagView";

const VerticalSplitLayout = () => {
	const { plugin } = useExplorer();
	const { settings, language } = plugin;

	const [folderPaneHeight, setFolderPaneHeight] = useState<
		number | undefined
	>();
	const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
	const [isFilesCollapsed, setIsFilesCollapsed] = useState(false);

	const pluginRef = useRef<HTMLDivElement>(null);
	useChangeActiveLeaf();

	const {
		highlightActionBar: highlight,
		autoHideActionBar: autoHide,
		showFolderView: showFolder,
		showTagView: showTag,
	} = settings;
	const { highlightActionBar } = useHighlightActionBar(highlight);
	const { autoHideActionBar } = useAutoHideActionBar(autoHide);
	const { showFolderView } = useShowFolderView(showFolder);
	const { showTagView } = useShowTagView(showTag);

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

	const renderIcon = (
		isCollapsed: boolean,
		caller: () => void,
		label: string
	) => (
		<div
			className={classNames(
				"ffs__action-button-wrapper ffs__collapse-pane-icon clickable-icon nav-action-button",
				{ "is-collapsed": isCollapsed }
			)}
			onClick={caller}
			data-tooltip-position="bottom"
			aria-label={label}
		>
			<ChevronRight className="ffs__action-button svg-icon" />
		</div>
	);

	const renderOpenPaneButton = (onOpen: () => void, label: string) =>
		renderIcon(true, onOpen, label);

	const renderClosePaneButton = (onClose: () => void, label: string) =>
		renderIcon(false, onClose, label);

	const getActionsContainerClassName = () =>
		classNames("ffs__actions-container nav-header", {
			"ffs__actions-container--highlight": highlightActionBar,
			"ffs__actions-container--auto-hide": autoHideActionBar,
		});

	const renderFoldersAndTagsPane = () => {
		const onOpenPane = () => setIsFoldersCollapsed(false);
		const onClosePane = () => setIsFoldersCollapsed(true);
		const copy = [showFolderView && "Folders", showTagView && "Tags"]
			.filter(Boolean)
			.join(" & ");
		if (isFoldersCollapsed) {
			const label =
				language === "zh" ? "展开文件夹/标签列表" : "Open folders/tags";
			return (
				<div className={getActionsContainerClassName()}>
					<div className="ffs__actions-section ffs__collapsed-folders nav-buttons-container">
						{copy}
					</div>
					<div className="ffs__actions-section nav-buttons-container">
						{renderOpenPaneButton(onOpenPane, label)}
					</div>
				</div>
			);
		}

		const label =
			language === "zh" ? "关闭文件夹/标签列表" : "Close folders/tags";
		return (
			<div
				className="ffs__layout-pane ffs__folders-pane--vertical"
				style={{
					height: isFilesCollapsed ? "100%" : folderPaneHeight,
				}}
			>
				<div className={getActionsContainerClassName()}>
					<FolderAndTagActionSection />
					<div className="ffs__actions-section nav-buttons-container">
						<ToggleFolderAndTagMode />
						{renderClosePaneButton(onClosePane, label)}
					</div>
				</div>
				<FolderAndTagTree />
			</div>
		);
	};

	const renderFilesPane = () => {
		const onOpenPane = () => setIsFilesCollapsed(false);
		const onClosePane = () => setIsFilesCollapsed(true);
		if (isFilesCollapsed) {
			const label = language === "zh" ? "展开文件列表" : "Open files";
			return (
				<div className={getActionsContainerClassName()}>
					<div className="ffs__actions-section ffs__collapsed-files nav-buttons-container">
						Files
					</div>
					<div className="ffs__actions-section nav-buttons-container">
						{renderOpenPaneButton(onOpenPane, label)}
					</div>
				</div>
			);
		}

		const label = language === "zh" ? "关闭文件列表" : "Close files";
		return (
			<div className="ffs__layout-pane ffs__files-pane--vertical">
				<div className={getActionsContainerClassName()}>
					<FileActionSection />
					<div className="ffs__actions-section nav-buttons-container">
						{renderClosePaneButton(onClosePane, label)}
					</div>
				</div>
				<FileTree />
			</div>
		);
	};

	return (
		<div className="ffs__layout ffs__layout--vertical" ref={pluginRef}>
			{renderFoldersAndTagsPane()}
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
