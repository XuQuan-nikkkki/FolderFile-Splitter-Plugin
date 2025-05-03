import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useExpandFolderByClickingOnElement } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";
import ExpandIcon from "../ExpandIcon";
import { uniq } from "src/utils";

type Props = {
	folder: TFolder;
};
const FolderExpandIcon = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const {
		hasFolderChildren,
		expandedFolderPaths,
		changeExpandedFolderPaths,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasFolderChildren: store.hasFolderChildren,
			expandedFolderPaths: store.expandedFolderPaths,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
		}))
	);

	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	const onToggleExpandState = (): void => {
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: uniq([...expandedFolderPaths, folder.path]);
			changeExpandedFolderPaths(folderPaths);
		}
	};

	const onClickExpandIcon = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "icon") return;
		e.stopPropagation();
		onToggleExpandState();
	};

	return (
		<ExpandIcon
			isExpanded={isFolderExpanded}
			hideIcon={!hasFolderChildren(folder)}
			onClickExpandIcon={onClickExpandIcon}
		/>
	);
};

export default FolderExpandIcon;
