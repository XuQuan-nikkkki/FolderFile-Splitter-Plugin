import { ActionsContainer, FileActionSection } from "./Actions";
import FileTree from "../FileTree";
import { useExplorer } from "src/hooks/useExplorer";
import { VERTICAL_SPLIT_LAYOUT_OPERATION_COPY } from "src/locales";
import { ClosePaneButton, OpenPaneButton } from "./TogglePaneButton";

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
				<div className="ffs__actions-section ffs__collapsed-files nav-buttons-container">
					Files
				</div>
				<div className="ffs__actions-section nav-buttons-container">
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
				<div className="ffs__actions-section nav-buttons-container">
					<ClosePaneButton
						onClose={() => setIsFilesCollapsed(true)}
						label={closeFiles[language]}
					/>
				</div>
			</ActionsContainer>
			<FileTree />
		</div>
	);
};

export default VerticalSplitFilesPane;
