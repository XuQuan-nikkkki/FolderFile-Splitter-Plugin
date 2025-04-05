import { useShallow } from "zustand/react/shallow";
import { TFolder } from "obsidian";

import { ExplorerStore } from "src/store";
import {
	useHideRootFolder,
	useShowHierarchyLines,
} from "src/hooks/useSettingsHandler";
import { useChangeFolder } from "src/hooks/useVaultChangeHandler";
import { useExplorer } from "src/hooks/useExplorer";

import Folder from "../Folder";
import PinnedFolders, { FolderOptions } from "./PinnedFolders";
import {
	StyledFolderTree,
	StyledFolderTreeItem,
	StyledSubfoldersGroup,
} from "./Styled";

type Props = {
	onOpenFilesPane?: () => void;
};
const FolderTree = ({ onOpenFilesPane = () => {} }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		rootFolder,
		folderSortRule,
		hasFolderChildren,
		getFoldersByParent,
		sortFolders,
		expandedFolderPaths,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			rootFolder: store.rootFolder,
			folderSortRule: store.folderSortRule,
			hasFolderChildren: store.hasFolderChildren,
			getFoldersByParent: store.getFoldersByParent,
			sortFolders: store.sortFolders,
			expandedFolderPaths: store.expandedFolderPaths,
			focusedFolder: store.focusedFolder,
			pinnedFolders: store.pinnedFolderPaths,
			order: store.foldersManualSortOrder,
		}))
	);

	const {
		showFolderHierarchyLines: defaultShowLines,
		hideRootFolder: defaultHideRootFolder,
	} = plugin.settings;
	const { showHierarchyLines } = useShowHierarchyLines(defaultShowLines);
	const { topFolders } = useChangeFolder();
	const { hideRootFolder } = useHideRootFolder(defaultHideRootFolder);

	const renderFolder = (folder: TFolder, options?: FolderOptions) => {
		const { isRoot, hideExpandIcon, disableDrag } = options ?? {};
		return (
			<Folder
				key={folder.path}
				folder={folder}
				isRoot={isRoot}
				hideExpandIcon={hideExpandIcon}
				disableDrag={disableDrag}
				onOpenFilesPane={onOpenFilesPane}
			/>
		);
	};

	const renderFolders = (folders: TFolder[]) => {
		const sortedFolders = sortFolders(
			folders,
			folderSortRule,
			plugin.settings.includeSubfolderFilesCount
		);
		return sortedFolders.map((folder) => {
			const isExpanded = expandedFolderPaths.includes(folder.path);
			return (
				<StyledFolderTreeItem key={folder.name}>
					{renderFolder(folder)}
					{isExpanded && hasFolderChildren(folder) && (
						<StyledSubfoldersGroup
							$showHierarchyLine={showHierarchyLines}
						>
							{renderFolders(getFoldersByParent(folder))}
						</StyledSubfoldersGroup>
					)}
				</StyledFolderTreeItem>
			);
		});
	};

	const maybeRenderRootFolder = () => {
		if (!rootFolder || hideRootFolder) return null;

		return (
			<StyledFolderTreeItem style={{ marginLeft: 4 }}>
				{renderFolder(rootFolder, { isRoot: true })}
			</StyledFolderTreeItem>
		);
	};

	return (
		<StyledFolderTree>
			<PinnedFolders renderFolder={renderFolder} />
			{maybeRenderRootFolder()}
			{renderFolders(topFolders)}
		</StyledFolderTree>
	);
};

export default FolderTree;
