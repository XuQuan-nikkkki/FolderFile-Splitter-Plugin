import classNames from "classnames";

import { ACTIONS_SECTION_CLASS_NAME } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useAutoHideActionBar,
	useHighlightActionBar,
} from "src/hooks/useSettingsHandler";

import CreateFile from "../FileActions/CreateFile";
import SearchFiles from "../FileActions/SearchFiles";
import SortFiles from "../FileActions/SortFiles";
import CreateFolder from "../FolderAndTagActions/CreateFolder";
import SortFolders from "../FolderAndTagActions/SortFoldersAndTags";
import ToggleFolders from "../FolderAndTagActions/ToggleFoldersAndTags";


export const FolderAndTagActionSection = () => (
	<div className={ACTIONS_SECTION_CLASS_NAME}>
		<CreateFolder />
		<SortFolders />
		<ToggleFolders />
	</div>
);

export const FileActionSection = () => (
	<div className={ACTIONS_SECTION_CLASS_NAME}>
		<CreateFile />
		<SortFiles />
		<SearchFiles />
	</div>
);

type Props = {
	children: React.ReactNode;
};
export const ActionsContainer = ({ children }: Props) => {
	const { plugin } = useExplorer();
	const { settings } = plugin;

	const { highlightActionBar } = useHighlightActionBar(
		settings.highlightActionBar
	);
	const { autoHideActionBar } = useAutoHideActionBar(
		settings.autoHideActionBar
	);

	const getActionsContainerClassName = () =>
		classNames("ffs__actions-container nav-header", {
			"ffs__actions-container--highlight": highlightActionBar,
			"ffs__actions-container--auto-hide": autoHideActionBar,
		});

	return <div className={getActionsContainerClassName()}>{children}</div>;
};
