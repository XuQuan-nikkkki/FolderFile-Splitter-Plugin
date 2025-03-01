import { Fragment, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import { TFolder } from "obsidian";

import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import Folder from "./Folder";
import { useShowHierarchyLines } from "src/hooks/useSettingsHandler";
import { useChangeFolder } from "src/hooks/useVaultChangeHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const Folders = ({ useFileTreeStore, plugin }: Props) => {
	const {
		rootFolder,
		folderSortRule,
		hasFolderChildren,
		getFoldersByParent,
		sortFolders,
		expandedFolderPaths,
		restoreExpandedFolderPaths,
		restoreLastFocusedFolder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			rootFolder: store.rootFolder,
			folderSortRule: store.folderSortRule,
			hasFolderChildren: store.hasFolderChildren,
			getFoldersByParent: store.getFoldersByParent,
			sortFolders: store.sortFolders,
			expandedFolderPaths: store.expandedFolderPaths,
			restoreExpandedFolderPaths: store.restoreExpandedFolderPaths,
			restoreLastFocusedFolder: store.restoreLastFocusedFolder,
		}))
	);

	const { showHierarchyLines } = useShowHierarchyLines(
		plugin.settings.showFolderHierarchyLines
	);
	const { topFolders } = useChangeFolder({ useFileTreeStore });

	useEffect(() => {
		restoreLastFocusedFolder();
		restoreExpandedFolderPaths();
	}, []);

	const maybeRenderHierarchyLine = () => {
		if (!showHierarchyLines) return null;
		return <div className="ffs-hierarchy-line"></div>;
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
					<Folder
						folder={folder}
						useFileTreeStore={useFileTreeStore}
						plugin={plugin}
					/>
					{isExpanded && hasFolderChildren(folder) && (
						<div className="ffs-sub-folders-section ffs-folder-wrapper">
							{maybeRenderHierarchyLine()}
							{renderFolders(getFoldersByParent(folder))}
						</div>
					)}
				</div>
			);
		});
	};

	const renderRootFolder = () => {
		if (!rootFolder) return null;

		return (
			<div className="ffs-folder-wrapper">
				{maybeRenderHierarchyLine()}
				<Folder
					folder={rootFolder}
					useFileTreeStore={useFileTreeStore}
					plugin={plugin}
					isRoot
				/>
			</div>
		);
	};

	return (
		<Fragment>
			{renderRootFolder()}
			{renderFolders(topFolders)}
		</Fragment>
	);
};

export default Folders;
