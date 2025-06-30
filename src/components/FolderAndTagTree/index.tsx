import classNames from "classnames";
import { TFolder } from "obsidian";
import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useHideRootFolder,
	useShowFolderView,
	useShowHierarchyLines,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { useChangeFolder } from "src/hooks/useVaultChangeHandler";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import Folder from "../Folder";
import Tag from "../Tag";

import PinnedFoldersAndTags, { RenderOptions } from "./PinnedFoldersAndTags";

type Props = {
	onOpenFilesPane?: () => void;
};
const FolderAndTagTree = ({ onOpenFilesPane = () => {} }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		rootFolder,
		folderSortRule,
		hasSubFolder,
		getSubFolders,
		sortFolders,
		expandedFolderPaths,
		focusedFolder,
		getTopLevelTags,
		sortTags,
		expandedTagPaths,
		getTagsByParent,
		hasSubTag,
		focusedTag,
		isTopLevelTag,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			rootFolder: store.rootFolder,
			folderSortRule: store.folderSortRule,
			hasSubFolder: store.hasSubFolder,
			getSubFolders: store.getSubFolders,
			sortFolders: store.sortFolders,
			expandedFolderPaths: store.expandedFolderPaths,
			focusedFolder: store.focusedFolder,
			pinnedFolders: store.pinnedFolderPaths,
			order: store.foldersManualSortOrder,
			getTopLevelTags: store.getTopLevelTags,
			sortTags: store.sortTags,
			expandedTagPaths: store.expandedTagPaths,
			getTagsByParent: store.getTagsByParent,
			hasSubTag: store.hasSubTag,
			focusedTag: store.focusedTag,
			isTopLevelTag: store.isTopLevelTag,
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

	const renderFolder = (folder: TFolder, options?: RenderOptions) => {
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
			plugin.settings.includeSubfolderFiles
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
						hasSubFolder(folder) &&
						renderSubfolders(renderFolders(getSubFolders(folder)))}
				</div>
			);
		});
	};

	const maybeRenderRootFolder = () => {
		if (!rootFolder || hideRootFolder || !showFolderView) return null;

		return (
			<div className="ffs__folder-tree-item tree-item nav-folder">
				{renderFolder(rootFolder)}
			</div>
		);
	};

	const renderTag = (tag: TagNode, options?: RenderOptions) => {
		const { disableHoverIndent, hideExpandIcon } = options ?? {};
		return (
			<Tag
				key={tag.name}
				tag={tag}
				hideExpandIcon={hideExpandIcon}
				disableHoverIndent={disableHoverIndent}
			/>
		);
	};

	const renderSubTags = (children: ReactNode) => {
		return (
			<div
				className={classNames(
					"ffs__sub-tags-group tree-item-children nav-folder-children"
				)}
				style={{
					borderInlineStart: showHierarchyLines ? undefined : "none",
				}}
			>
				{children}
			</div>
		);
	};

	const renderTags = (tags: TagNode[]) => {
		if (!showTagView) return;

		const sortedTags = sortTags(tags);
		return sortedTags.map((tag, index) => {
			const isExpanded = expandedTagPaths.includes(tag.fullPath);
			return (
				<div
					key={tag.name}
					className={classNames(
						"ffs__tag-tree-item tree-item nav-folder",
						{
							"is-collapsed":
								!isExpanded &&
								focusedTag?.fullPath !== tag.fullPath,
							"ffs__tag-tree--start":
								index === 0 &&
								showFolderView &&
								isTopLevelTag(tag),
						}
					)}
				>
					{renderTag(tag)}
					{isExpanded &&
						hasSubTag(tag) &&
						renderSubTags(
							renderTags(getTagsByParent(tag.fullPath))
						)}
				</div>
			);
		});
	};

	const renderEmptyDiv = () => (
		// This is a workaround to fix the issue of the first folder not being rendered correctly
		<div style={{ width: "100%", height: 0.1, marginBottom: 0 }}></div>
	);

	return (
		<div className="ffs__tree ffs__folder-tree nav-files-container">
			<PinnedFoldersAndTags
				renderFolder={renderFolder}
				renderTag={renderTag}
			/>
			<div>
				{renderEmptyDiv()}
				{maybeRenderRootFolder()}
				{renderFolders(topFolders)}
				{renderTags(getTopLevelTags())}
			</div>
		</div>
	);
};

export default FolderAndTagTree;
