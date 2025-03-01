import { Fragment, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import { TFolder } from "obsidian";

import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import Folder from "./Folder";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFolder } from "src/utils";
import { useShowHierarchyLines } from "src/hooks/useSettingsHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const Folders = ({ useFileTreeStore, plugin }: Props) => {
	const {
		rootFolder,
		folderSortRule,
		getTopLevelFolders,
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
			getTopLevelFolders: store.getTopLevelFolders,
			getFoldersByParent: store.getFoldersByParent,
			sortFolders: store.sortFolders,
			expandedFolderPaths: store.expandedFolderPaths,
			restoreExpandedFolderPaths: store.restoreExpandedFolderPaths,
			restoreLastFocusedFolder: store.restoreLastFocusedFolder,
		}))
	);

	const topLevelFolders = getTopLevelFolders();
	const [topFolders, setTopFolders] = useState<TFolder[]>([]);
	const { showHierarchyLines } = useShowHierarchyLines(
		plugin.settings.showFolderHierarchyLines
	);

	useEffect(() => {
		restoreLastFocusedFolder();
		restoreExpandedFolderPaths();
		setTopFolders(topLevelFolders);
	}, []);

	useEffect(() => {
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, []);

	const onDeleteFolderFromList = (folder: TFolder) => {
		setTopFolders((prevFolders) =>
			prevFolders.filter((prevFolder) => prevFolder.path !== folder.path)
		);
	};

	const onUpdateFolderInList = (folder: TFolder) => {
		setTopFolders((prevFolders) =>
			prevFolders.map((prevFolder) =>
				prevFolder.path === folder.path ? folder : prevFolder
			)
		);
	};

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file: folder, changeType } = event.detail;
		if (!isFolder(folder)) return;
		restoreExpandedFolderPaths();

		switch (changeType) {
			case "create":
				if (folder.parent?.isRoot()) {
					setTopFolders((prevFolders) => [...prevFolders, folder]);
				}
				break;
			case "delete":
				onDeleteFolderFromList(folder);
				break;
			case "rename":
				onUpdateFolderInList(folder);
				break;
			case "modify":
				onUpdateFolderInList(folder);
				break;
		}
	};

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
