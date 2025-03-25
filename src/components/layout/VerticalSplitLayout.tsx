import { useEffect, useState, useRef } from "react";

import { FFS_FOLDER_PANE_HEIGHT_KEY } from "src/assets/constants";
import {
	VerticalContainer,
	VerticalFilesPane,
	VerticalFoldersPane,
} from "./Layout";
import { ChevronDown, ChevronRight } from "src/assets/icons";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { VerticalDraggableDivider } from "./DraggableDivider";
import {
	Actions,
	ActionsSection,
	BasicFileActions,
	BasicFolderActions,
} from "./Actions";
import Files from "../Files";
import Folders from "../Folders";

const VerticalSplitLayout = () => {
	const [folderPaneHeight, setFolderPaneHeight] = useState<
		number | undefined
	>();

	const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
	const [isFilesCollapsed, setIsFilesCollapsed] = useState(false);

	const pluginRef = useRef<HTMLDivElement>(null);

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

	const renderFoldersPane = () => {
		if (isFoldersCollapsed) {
			return (
				<Actions>
					<ActionsSection>Folders</ActionsSection>
					<ActionsSection>
						<StyledActionIconWrapper
							onClick={() => setIsFoldersCollapsed(false)}
						>
							<ChevronRight />
						</StyledActionIconWrapper>
					</ActionsSection>
				</Actions>
			);
		}
		return (
			<VerticalFoldersPane
				style={{
					height: isFilesCollapsed ? "100%" : folderPaneHeight,
				}}
			>
				<Actions>
					<BasicFolderActions />
					<ActionsSection>
						<StyledActionIconWrapper
							onClick={() => setIsFoldersCollapsed(true)}
						>
							<ChevronDown />
						</StyledActionIconWrapper>
					</ActionsSection>
				</Actions>
				<Folders />
			</VerticalFoldersPane>
		);
	};

	const renderFilesPane = () => {
		if (isFilesCollapsed) {
			return (
				<Actions>
					<ActionsSection>Files</ActionsSection>
					<ActionsSection>
						<StyledActionIconWrapper
							onClick={() => setIsFilesCollapsed(false)}
						>
							<ChevronRight />
						</StyledActionIconWrapper>
					</ActionsSection>
				</Actions>
			);
		}
		return (
			<VerticalFilesPane>
				<Actions>
					<BasicFileActions />
					<ActionsSection>
						<StyledActionIconWrapper
							onClick={() => setIsFilesCollapsed(true)}
						>
							<ChevronDown />
						</StyledActionIconWrapper>
					</ActionsSection>
				</Actions>
				<Files />
			</VerticalFilesPane>
		);
	};

	return (
		<VerticalContainer ref={pluginRef}>
			{renderFoldersPane()}
			{!isFilesCollapsed && !isFoldersCollapsed && (
				<VerticalDraggableDivider
					initialHeight={folderPaneHeight}
					onChangeHeight={onChangeFolderPaneHeight}
				/>
			)}
			{renderFilesPane()}
		</VerticalContainer>
	);
};

export default VerticalSplitLayout;
