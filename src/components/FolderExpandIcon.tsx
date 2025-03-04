import { TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { ReactNode } from "react";

import { ArrowDownIcon, ArrowRightIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { useExpandFolderByClickingOnElement } from "src/hooks/useSettingsHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	isRoot?: boolean;
};
const FolderExpandIcon = ({
	folder,
	useFileTreeStore,
	plugin,
	isRoot = false,
}: Props) => {
	const {
		hasFolderChildren,
		expandedFolderPaths,
		changeExpandedFolderPaths,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
		if (isRoot) return;
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

	const isExpanded = isRoot || expandedFolderPaths.includes(folder.path);
	let content: ReactNode;
	if (!hasFolderChildren(folder) || isRoot) {
		content = null;
	} else {
		content = isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />;
	}

	return (
		<span
			className="ffs-folder-arrow-icon-wrapper"
			onClick={onClickExpandIcon}
		>
			{content}
		</span>
	);
};

export default FolderExpandIcon;
