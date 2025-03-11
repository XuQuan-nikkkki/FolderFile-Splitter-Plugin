import { TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { ReactNode } from "react";
import styled from "styled-components";

import { ArrowDownIcon, ArrowRightIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { useExpandFolderByClickingOnElement } from "src/hooks/useSettingsHandler";

const IconWrapper = styled.div<{ $isFocused: boolean }>`
	width: 14px;
	display: flex;
	align-items: center;
	margin-right: 2px;
	padding: 2px;

	svg {
		width: 8px;
		height: 8px;
		fill: ${({ $isFocused }) =>
			$isFocused ? "var(--text-on-accent)" : "var(--text-normal)"};
	}
`;

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	isFocused?: boolean;
};
const FolderExpandIcon = ({
	folder,
	useFileTreeStore,
	plugin,
	isFocused = false,
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
		content = isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />;
	}

	return (
		<IconWrapper onClick={onClickExpandIcon} $isFocused={isFocused}>
			{content}
		</IconWrapper>
	);
};

export default FolderExpandIcon;
