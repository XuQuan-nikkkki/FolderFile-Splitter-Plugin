import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { useChangeFolder, useChangeTag } from "src/hooks/useVaultChangeHandler";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import FolderTreeItem from "./FolderTreeItem";
import PinnedFoldersAndTags from "./PinnedFoldersAndTags";
import RootFolder from "./RootFolder";
import TagTreeItem from "./TagTreeItem";

const FolderAndTagTree = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const { sortFolders, sortTags } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			sortFolders: store.sortFolders,
			sortTags: store.sortTags,
			// for dependency tracking only
			foldersOrder: store.foldersManualSortOrder,
		}))
	);

	const {
		showFolderView: defaultShowFolderView,
		showTagView: defaultShowTagView,
	} = plugin.settings;
	const { topFolders } = useChangeFolder();
	const { topTags } = useChangeTag();
	const { showFolderView } = useShowFolderView(defaultShowFolderView);
	const { showTagView } = useShowTagView(defaultShowTagView);

	const renderFolders = (folders: TFolder[]) => {
		if (!showFolderView) return;

		const sortedFolders = sortFolders(folders);
		return sortedFolders.map((folder) => (
			<FolderTreeItem folder={folder} key={folder.path} />
		));
	};

	const renderTags = (tags: TagNode[]) => {
		if (!showTagView) return;

		const sortedTags = sortTags(tags);
		return sortedTags.map((tag, index) => (
			<TagTreeItem tag={tag} index={index} key={tag.fullPath} />
		));
	};

	const renderEmptyDiv = () => (
		// This is a workaround to fix the issue of the first folder not being rendered correctly
		<div style={{ width: "100%", height: 0.1, marginBottom: 0 }}></div>
	);

	return (
		<div className="ffs__tree ffs__folder-tree nav-files-container">
			<PinnedFoldersAndTags />
			<div>
				{renderEmptyDiv()}
				<RootFolder />
				{renderFolders(topFolders)}
				{renderTags(topTags)}
			</div>
		</div>
	);
};

export default FolderAndTagTree;
