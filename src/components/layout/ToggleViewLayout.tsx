import { useState } from "react";

import {
	ToggleContainer,
	ToggledOnFilesPane,
	ToggledOnFoldersPane,
	ToggledOffPaneTitle,
	ToggledOffIconWrapper,
} from "./Layout";
import { PanelRightClose, PanelRightOpen } from "src/assets/icons";
import { Actions, BasicFileActions, BasicFolderActions } from "./Actions";
import Folders from "../Folders";
import Files from "../Files";

const ToggleViewLayout = () => {
	const [isFoldersPaneVisible, setIsFoldersPaneVisible] =
		useState<boolean>(true);

	const onOpenFilesPane = () => {
		setIsFoldersPaneVisible(false);
	};

	const onOpenFoldersPane = () => {
		setIsFoldersPaneVisible(true);
	};

	if (isFoldersPaneVisible) {
		return (
			<ToggleContainer $offSide="right">
				<ToggledOnFoldersPane>
					<Actions>
						<BasicFolderActions />
					</Actions>
					<Folders onOpenFilesPane={onOpenFilesPane} />
				</ToggledOnFoldersPane>
				<ToggledOffIconWrapper onClick={onOpenFilesPane}>
					<PanelRightOpen />
					<ToggledOffPaneTitle>Files</ToggledOffPaneTitle>
				</ToggledOffIconWrapper>
			</ToggleContainer>
		);
	}

	return (
		<ToggleContainer $offSide="left">
			<ToggledOffIconWrapper onClick={onOpenFoldersPane}>
				<PanelRightClose />
				<ToggledOffPaneTitle>Folders</ToggledOffPaneTitle>
			</ToggledOffIconWrapper>
			<ToggledOnFilesPane>
				<Actions>
					<BasicFileActions />
				</Actions>
				<Files onOpenFoldersPane={onOpenFoldersPane} />
			</ToggledOnFilesPane>
		</ToggleContainer>
	);
};

export default ToggleViewLayout;
