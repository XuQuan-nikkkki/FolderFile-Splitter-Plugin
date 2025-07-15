import classNames from "classnames";

import { ACTIONS_SECTION_CLASS_NAME } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { VERTICAL_SPLIT_LAYOUT_OPERATION_COPY } from "src/locales";

import ToggleFolderAndTagMode from "../FolderAndTagActions/ToggleFolderAndTagView";
import FolderAndTagTree from "../FolderAndTagTree";

import { ActionsContainer, FolderAndTagActionSection } from "./Actions";
import { ClosePaneButton, OpenPaneButton } from "./TogglePaneButton";

type Props = {
	folderPaneHeight: number | undefined;
	isFilesCollapsed: boolean;
	isFoldersCollapsed: boolean;
	setIsFoldersCollapsed: (isCollapsed: boolean) => void;
};
const VerticalSplitFoldersAndTagsPane = ({
	folderPaneHeight,
	isFilesCollapsed,
	isFoldersCollapsed,
	setIsFoldersCollapsed,
}: Props) => {
	const { plugin } = useExplorer();
	const { settings, language } = plugin;

	const { showFolderView: showFolder, showTagView: showTag } = settings;
	const { showFolderView } = useShowFolderView(showFolder);
	const { showTagView } = useShowTagView(showTag);

	const { openFoldersAndTags, closeFoldersAndTags } =
		VERTICAL_SPLIT_LAYOUT_OPERATION_COPY;

	const copy = [showFolderView && "Folders", showTagView && "Tags"]
		.filter(Boolean)
		.join(" & ");
	if (isFoldersCollapsed) {
		return (
			<ActionsContainer>
				<div className={classNames("ffs__collapsed-folders", ACTIONS_SECTION_CLASS_NAME)}>
					{copy}
				</div>
				<div className={ACTIONS_SECTION_CLASS_NAME}>
					<OpenPaneButton
						onOpen={() => setIsFoldersCollapsed(false)}
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
				<div className={ACTIONS_SECTION_CLASS_NAME}>
					<ToggleFolderAndTagMode />
					<ClosePaneButton
						onClose={() => setIsFoldersCollapsed(true)}
						label={closeFoldersAndTags[language]}
					/>
				</div>
			</ActionsContainer>
			<FolderAndTagTree />
		</div>
	);
};

export default VerticalSplitFoldersAndTagsPane;
