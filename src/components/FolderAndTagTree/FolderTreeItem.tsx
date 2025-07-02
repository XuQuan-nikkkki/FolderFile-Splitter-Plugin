import classNames from "classnames";
import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useShowHierarchyLines } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";

import Folder from "../Folder";

import { getSubItemsStyle, SUB_ITEMS_CLASSNAMES } from "./TagTreeItem";

type Props = {
	folder: TFolder;
};
const FolderTreeItem = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const {
		getSubFolders,
		sortFolders,
		isFolderExpanded,
		isFocusedFolder,
		hasSubFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getSubFolders: store.getSubFolders,
			sortFolders: store.sortFolders,
			isFolderExpanded: store.isFolderExpanded,
			isFocusedFolder: store.isFocusedFolder,
			hasSubFolder: store.hasSubFolder,

			// for dependency tracking only
			expandedFolderPaths: store.expandedFolderPaths,
		}))
	);

	const { showHierarchyLines } = useShowHierarchyLines(
		settings.showFolderHierarchyLines
	);

	const isExpanded = isFolderExpanded(folder);
	const subFolders = sortFolders(getSubFolders(folder));
	const showSubfolders = isExpanded && hasSubFolder(folder);

	const renderSubfolders = () => {
		if (!showSubfolders) return null;
		return (
			<div
				className={`ffs__subfolders-group ${SUB_ITEMS_CLASSNAMES}`}
				style={getSubItemsStyle(showHierarchyLines)}
			>
				{subFolders.map((folder) => (
					<FolderTreeItem folder={folder} key={folder.path} />
				))}
			</div>
		);
	};

	const getClassNames = () =>
		classNames("ffs__folder-tree-item tree-item nav-folder", {
			"is-collapsed": !isExpanded && isFocusedFolder(folder),
		});

	return (
		<div className={getClassNames()} key={folder.name}>
			<Folder key={folder.path} folder={folder} />
			{renderSubfolders()}
		</div>
	);
};

export default FolderTreeItem;
