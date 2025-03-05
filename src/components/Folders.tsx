import { useEffect, useRef, useState } from "react";
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
		focusedFolder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			rootFolder: store.rootFolder,
			folderSortRule: store.folderSortRule,
			hasFolderChildren: store.hasFolderChildren,
			getFoldersByParent: store.getFoldersByParent,
			sortFolders: store.sortFolders,
			expandedFolderPaths: store.expandedFolderPaths,
			focusedFolder: store.focusedFolder,
		}))
	);

	const { showHierarchyLines } = useShowHierarchyLines(
		plugin.settings.showFolderHierarchyLines
	);
	const { topFolders } = useChangeFolder({ useFileTreeStore });
	const [selectedFolders, setSelectedFolders] = useState<TFolder[]>([]);
	const [draggingFolders, setDraggingFolders] = useState<TFolder[]>([]);

	const foldersRef = useRef<HTMLDivElement>(null);

	const onClickOutside = (e: MouseEvent) => {
		if (
			foldersRef?.current &&
			!foldersRef.current.contains(e.target as Node)
		) {
			setSelectedFolders(focusedFolder ? [focusedFolder] : []);
		}
	};

	useEffect(() => {
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [focusedFolder]);

	const maybeRenderHierarchyLine = () => {
		if (!showHierarchyLines) return null;
		return <div className="ffs-hierarchy-line"></div>;
	};

	const renderFolder = (folder: TFolder, isRoot?: boolean) => (
		<Folder
			folder={folder}
			useFileTreeStore={useFileTreeStore}
			plugin={plugin}
			selectedFolders={selectedFolders}
			setSelectedFolders={setSelectedFolders}
			draggingFolders={draggingFolders}
			setDraggingFolders={setDraggingFolders}
			isRoot={isRoot}
		/>
	);

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
				{renderFolder(rootFolder, true)}
			</div>
		);
	};

	return (
		<div ref={foldersRef}>
			{renderRootFolder()}
			{renderFolders(topFolders)}
		</div>
	);
};

export default Folders;
