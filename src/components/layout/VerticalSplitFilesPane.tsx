import classNames from "classnames";

import { ACTIONS_SECTION_CLASS_NAME } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import { VERTICAL_SPLIT_LAYOUT_OPERATION_COPY } from "src/locales";

import FileTree from "../FileTree";

import { ActionsContainer, FileActionSection } from "./Actions";
import { ClosePaneButton, OpenPaneButton } from "./TogglePaneButton";
import ViewModeDisplay from "./ViewModeDisplay";

type Props = {
	isFilesCollapsed: boolean;
	setIsFilesCollapsed: (isCollapsed: boolean) => void;
};
const VerticalSplitFilesPane = ({
	isFilesCollapsed,
	setIsFilesCollapsed,
}: Props) => {
	const { plugin } = useExplorer();
	const { language } = plugin;

	const { openFiles, closeFiles } = VERTICAL_SPLIT_LAYOUT_OPERATION_COPY;
	if (isFilesCollapsed) {
		return (
			<ActionsContainer>
				<div
					className={classNames(
						"ffs__collapsed-files",
						ACTIONS_SECTION_CLASS_NAME
					)}
				>
					Files
				</div>
				<div className={ACTIONS_SECTION_CLASS_NAME}>
					<OpenPaneButton
						onOpen={() => setIsFilesCollapsed(false)}
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
				<div className={ACTIONS_SECTION_CLASS_NAME}>
					<ClosePaneButton
						onClose={() => setIsFilesCollapsed(true)}
						label={closeFiles[language]}
					/>
				</div>
			</ActionsContainer>
			<ViewModeDisplay />
			<FileTree />
		</div>
	);
};

export default VerticalSplitFilesPane;
