import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { ReactNode } from "react";
import classNames from "classnames";

import { ChevronRight } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import { useExpandFolderByClickingOnElement } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";

type Props = {
	folder: TFolder;
};
const FolderExpandIcon = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

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

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	const { settings } = plugin;
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);

	const onToggleExpandState = (): void => {
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: [...expandedFolderPaths, folder.path];
			changeExpandedFolderPaths(folderPaths);
		}
	};

	const onClickExpandIcon = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "icon") return;
		e.stopPropagation();
		onToggleExpandState();
	};

	let content: ReactNode;
	if (!hasFolderChildren(folder)) {
		content = null;
	} else {
		content = <ChevronRight className="ffs__expand-icon svg-icon right-triangle" />;
	}

	const isExpanded = expandedFolderPaths.includes(folder.path);
	return (
		<div
			className={classNames("tree-item-icon collapse-icon", {
				"is-collapsed": !isExpanded,
			})}
			onClick={onClickExpandIcon}
		>
			{content}
		</div>
	);
};

export default FolderExpandIcon;
