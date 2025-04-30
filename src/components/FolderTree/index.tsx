import { useShallow } from "zustand/react/shallow";
import { TFolder } from "obsidian";
import classNames from "classnames";

import { ExplorerStore, TagNode } from "src/store";
import {
	useHideRootFolder,
	useShowFolderView,
	useShowHierarchyLines,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { useChangeFolder } from "src/hooks/useVaultChangeHandler";
import { useExplorer } from "src/hooks/useExplorer";

import Folder from "../Folder";
import PinnedFolders, { FolderOptions } from "./PinnedFolders";
import { ReactNode } from "react";

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
		focusedFolder,
		getTopLevelTags,
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
			getTopLevelTags: store.getTopLevelTags,
		}))
	);

	const {
		showFolderHierarchyLines: defaultShowLines,
		hideRootFolder: defaultHideRootFolder,
		showFolderView: defaultShowFolderView,
		showTagView: defaultShowTagView,
	} = plugin.settings;
	const { showHierarchyLines } = useShowHierarchyLines(defaultShowLines);
	const { topFolders } = useChangeFolder();
	const { hideRootFolder } = useHideRootFolder(defaultHideRootFolder);
	const { showFolderView } = useShowFolderView(defaultShowFolderView);
	const { showTagView } = useShowTagView(defaultShowTagView);

	const renderFolder = (folder: TFolder, options?: FolderOptions) => {
		const { hideExpandIcon, disableDrag, disableHoverIndent } =
			options ?? {};
		return (
			<Folder
				key={folder.path}
				folder={folder}
				hideExpandIcon={hideExpandIcon}
				disableDrag={disableDrag}
				onOpenFilesPane={onOpenFilesPane}
				disableHoverIndent={disableHoverIndent}
			/>
		);
	};

	const renderSubfolders = (children: ReactNode) => {
		return (
			<div
				className={classNames(
					"ffs__subfolders-group tree-item-children nav-folder-children"
				)}
				style={{
					borderInlineStart: showHierarchyLines ? undefined : "none",
				}}
			>
				{children}
			</div>
		);
	};

	const renderFolders = (folders: TFolder[]) => {
		if (!showFolderView) return;

		const sortedFolders = sortFolders(
			folders,
			folderSortRule,
			plugin.settings.includeSubfolderFilesCount
		);
		return sortedFolders.map((folder) => {
			const isExpanded = expandedFolderPaths.includes(folder.path);
			return (
				<div
					className={classNames(
						"ffs__folder-tree-item tree-item nav-folder",
						{
							"is-collapsed":
								!isExpanded &&
								focusedFolder?.path !== folder.path,
						}
					)}
					key={folder.name}
				>
					{renderFolder(folder)}
					{isExpanded &&
						hasFolderChildren(folder) &&
						renderSubfolders(
							renderFolders(getFoldersByParent(folder))
						)}
				</div>
			);
		});
	};

	const maybeRenderRootFolder = () => {
		if (!rootFolder || hideRootFolder) return null;

		return (
			<div className="ffs__folder-tree-item tree-item nav-folder">
				{renderFolder(rootFolder)}
			</div>
		);
	};

	const renderTags = (tags: TagNode[]) => {
		if (!showTagView) return;
		// TODO: to be implemented
		return (
			<div>
				{tags.map((tag) => (
					<div key={tag.name}>{tag.name}</div>
				))}
			</div>
		);
	};

	const renderEmptyDiv = () => (
		// This is a workaround to fix the issue of the first folder not being rendered correctly
		<div style={{ width: "100%", height: 0.1, marginBottom: 0 }}></div>
	);

	return (
		<div className="ffs__tree ffs__folder-tree nav-files-container">
			<PinnedFolders renderFolder={renderFolder} />
			<div>
				{renderEmptyDiv()}
				{maybeRenderRootFolder()}
				{renderFolders(topFolders)}
				{renderTags(getTopLevelTags())}
			</div>
		</div>
	);
};

export default FolderTree;
