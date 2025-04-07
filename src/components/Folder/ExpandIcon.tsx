import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { ReactNode } from "react";
import classNames from "classnames";

import { ArrowDownIcon, ArrowRightIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import { useExpandFolderByClickingOnElement } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";

type Props = {
	folder: TFolder;
	isFocused?: boolean;
};
const FolderExpandIcon = ({ folder, isFocused = false }: Props) => {
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

	const isExpanded = expandedFolderPaths.includes(folder.path);
	let content: ReactNode;
	if (!hasFolderChildren(folder)) {
		content = null;
	} else {
		const iconClassName = "ffs__expand-icon";
		content = isExpanded ? (
			<ArrowDownIcon className={iconClassName} />
		) : (
			<ArrowRightIcon className={iconClassName} />
		);
	}

	return (
		<div
			className={classNames("ffs__expand-icon-wrapper", {
				"ffs__expand-icon-wrapper--active": isFocused,
			})}
			onClick={onClickExpandIcon}
		>
			{content}
		</div>
	);
};

export default FolderExpandIcon;
