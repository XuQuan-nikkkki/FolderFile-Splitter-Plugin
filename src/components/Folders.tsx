import { useShallow } from "zustand/react/shallow";
import { TFolder } from "obsidian";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import { useShowHierarchyLines } from "src/hooks/useSettingsHandler";
import { useChangeFolder } from "src/hooks/useVaultChangeHandler";
import Folder from "./Folder";
import { useFileTree } from "./FileTree";
import PinnedFolders, { FolderOptions } from "./PinnedFolders";

const StyledFolders = styled.div`
	flex: 1;
	overflow-y: auto;
`;

const FoldersSection = styled.div<{ $showHierarchyLine?: boolean }>`
	position: relative;
	margin-left: 12px;
	padding-left: 2px;
	border-left: ${({ $showHierarchyLine }) =>
		$showHierarchyLine
			? "var(--border-width) solid var(--interactive-hover)"
			: undefined};
`;

const Folders = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		rootFolder,
		folderSortRule,
		hasFolderChildren,
		getFoldersByParent,
		sortFolders,
		expandedFolderPaths,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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

	const { showHierarchyLines } = useShowHierarchyLines(
		plugin.settings.showFolderHierarchyLines
	);
	const { topFolders } = useChangeFolder();

	const renderFolder = (folder: TFolder, options?: FolderOptions) => {
		const { isRoot, hideExpandIcon, disableDrag } = options ?? {};
		return (
			<Folder
				key={folder.path}
				folder={folder}
				isRoot={isRoot}
				hideExpandIcon={hideExpandIcon}
				disableDrag={disableDrag}
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
				<div key={folder.name}>
					{renderFolder(folder)}
					{isExpanded && hasFolderChildren(folder) && (
						<FoldersSection $showHierarchyLine={showHierarchyLines}>
							{renderFolders(getFoldersByParent(folder))}
						</FoldersSection>
					)}
				</div>
			);
		});
	};

	const renderRootFolder = () => {
		if (!rootFolder) return null;

		return (
			<div style={{ marginLeft: 4 }}>
				{renderFolder(rootFolder, { isRoot: true })}
			</div>
		);
	};

	return (
		<StyledFolders>
			<PinnedFolders renderFolder={renderFolder} />
			<div>
				{renderRootFolder()}
				{renderFolders(topFolders)}
			</div>
		</StyledFolders>
	);
};

export default Folders;
