import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_HEIGHT_KEY } from "src/assets/constants";
import { ChevronDown, ChevronRight } from "src/assets/icons";
import { VerticalDraggableDivider } from "./DraggableDivider";
import {
	StyledActionsContainer,
	StyledActionsSection,
	FileActionSection,
	FolderActionSection,
	StyledActionButtonWrapper,
} from "./Actions";
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

	const renderOpenPaneButton = (onOpen: () => void) => (
		<StyledActionButtonWrapper onClick={onOpen}>
			<ChevronRight className="ffs__action-button" />
		</StyledActionButtonWrapper>
	);

	const renderClosePaneButton = (onClose: () => void) => (
		<StyledActionButtonWrapper onClick={onClose}>
			<ChevronDown className="ffs__action-button" />
		</StyledActionButtonWrapper>
	);

	const renderFoldersPane = () => {
		const onOpenPane = () => setIsFoldersCollapsed(false);
		const onClosePane = () => setIsFoldersCollapsed(true);
		if (isFoldersCollapsed) {
			return (
				<StyledActionsContainer className="ffs__actions-container--folder">
					<StyledActionsSection>Folders</StyledActionsSection>
					<StyledActionsSection>
						{renderOpenPaneButton(onOpenPane)}
					</StyledActionsSection>
				</StyledActionsContainer>
			);
		}
		return (
			<div
				className="ffs__layout-pane ffs__folders-pane--vertical"
				style={{
					height: isFilesCollapsed ? "100%" : folderPaneHeight,
				}}
			>
				<StyledActionsContainer className="ffs__actions-container--folder">
					<FolderActionSection />
					<StyledActionsSection>
						{renderClosePaneButton(onClosePane)}
					</StyledActionsSection>
				</StyledActionsContainer>
				<FolderTree />
			</div>
		);
	};

	const renderFilesPane = () => {
		const onOpenPane = () => setIsFilesCollapsed(false);
		const onClosePane = () => setIsFilesCollapsed(true);
		if (isFilesCollapsed) {
			return (
				<StyledActionsContainer className="ffs__actions-container--file">
					<StyledActionsSection>Files</StyledActionsSection>
					<StyledActionsSection>
						{renderOpenPaneButton(onOpenPane)}
					</StyledActionsSection>
				</StyledActionsContainer>
			);
		}
		return (
			<div className="ffs__layout-pane ffs__files-pane--vertical">
				<StyledActionsContainer className="ffs__actions-container--file">
					<FileActionSection />
					<StyledActionsSection>
						{renderClosePaneButton(onClosePane)}
					</StyledActionsSection>
				</StyledActionsContainer>
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
