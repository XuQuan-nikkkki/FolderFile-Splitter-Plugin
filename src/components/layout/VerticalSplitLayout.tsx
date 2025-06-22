import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_HEIGHT_KEY } from "src/assets/constants";
import { VerticalDraggableDivider } from "./DraggableDivider";
import {
	ActionsContainer,
	FileActionSection,
	FolderAndTagActionSection,
} from "./Actions";
import FileTree from "../FileTree";
import FolderAndTagTree from "../FolderAndTagTree";
import useChangeActiveLeaf from "src/hooks/useChangeActiveLeaf";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import ToggleFolderAndTagMode from "../FolderAndTagActions/ToggleFolderAndTagView";
import { VERTICAL_SPLIT_LAYOUT_OPERATION_COPY } from "src/locales";
import { toValidNumber } from "src/utils";
import { ClosePaneButton, OpenPaneButton } from "./TogglePaneButton";

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

	const { showFolderView: showFolder, showTagView: showTag } = settings;
	const { showFolderView } = useShowFolderView(showFolder);
	const { showTagView } = useShowTagView(showTag);

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

	const renderFoldersAndTagsPane = () => {
		const onOpenPane = () => setIsFoldersCollapsed(false);
		const onClosePane = () => setIsFoldersCollapsed(true);

		const { openFoldersAndTags, closeFoldersAndTags } =
			VERTICAL_SPLIT_LAYOUT_OPERATION_COPY;

		const copy = [showFolderView && "Folders", showTagView && "Tags"]
			.filter(Boolean)
			.join(" & ");
		if (isFoldersCollapsed) {
			return (
				<ActionsContainer>
					<div className="ffs__actions-section ffs__collapsed-folders nav-buttons-container">
						{copy}
					</div>
					<div className="ffs__actions-section nav-buttons-container">
						<OpenPaneButton
							onOpen={onOpenPane}
							label={openFoldersAndTags[language]}
						/>
					</div>
				</ActionsContainer>
			);
		}

		return (
			<div
				className="ffs__layout-pane ffs__folders-pane--vertical"
				style={{
					height: isFilesCollapsed ? "100%" : folderPaneHeight,
				}}
			>
				<ActionsContainer>
					<FolderAndTagActionSection />
					<div className="ffs__actions-section nav-buttons-container">
						<ToggleFolderAndTagMode />
						<ClosePaneButton
							onClose={onClosePane}
							label={closeFoldersAndTags[language]}
						/>
					</div>
				</ActionsContainer>
				<FolderAndTagTree />
			</div>
		);
	};

	const renderFilesPane = () => {
		const onOpenPane = () => setIsFilesCollapsed(false);
		const onClosePane = () => setIsFilesCollapsed(true);

		const { openFiles, closeFiles } = VERTICAL_SPLIT_LAYOUT_OPERATION_COPY;
		if (isFilesCollapsed) {
			return (
				<ActionsContainer>
					<div className="ffs__actions-section ffs__collapsed-files nav-buttons-container">
						Files
					</div>
					<div className="ffs__actions-section nav-buttons-container">
						<OpenPaneButton
							onOpen={onOpenPane}
							label={openFiles[language]}
						/>
					</div>
				</ActionsContainer>
			);
		}

		return (
			<div className="ffs__layout-pane ffs__files-pane--vertical">
				<ActionsContainer>
					<FileActionSection />
					<div className="ffs__actions-section nav-buttons-container">
						<ClosePaneButton
							onClose={onClosePane}
							label={closeFiles[language]}
						/>
					</div>
				</ActionsContainer>
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
					onChangeHeight={changeHeightAndSave}
				/>
			)}
			{renderFilesPane()}
		</div>
	);
};

export default VerticalSplitLayout;
