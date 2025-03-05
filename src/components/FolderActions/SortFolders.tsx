import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore, FolderSortRule } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import SortAction from "../SortAction";

type FolderSortRuleItem = {
	text: string;
	rule: FolderSortRule;
};
type FolderSortRuleGroup = FolderSortRuleItem[];
const FolderSortByNameRules: FolderSortRuleGroup = [
	{ text: "Folder name(A to Z)", rule: "FolderNameAscending" },
	{ text: "Folder name(Z to A)", rule: "FolderNameDescending" },
];
const FolderSortByFilesCountRules: FolderSortRuleGroup = [
	{
		text: "Files count(small to large)",
		rule: "FilesCountAscending",
	},
	{
		text: "Files count(large to small)",
		rule: "FilesCountDescending",
	},
];

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const SortFolders = ({ useFileTreeStore, plugin }: Props) => {
	const {
		folderSortRule,
		changeFolderSortRule,
		isFoldersInAscendingOrder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			folderSortRule: store.folderSortRule,
			isFoldersInAscendingOrder: store.isFoldersInAscendingOrder,
			changeFolderSortRule: store.changeFolderSortRule,
		}))
	);

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={[FolderSortByNameRules, FolderSortByFilesCountRules]}
			menuName="sort-folders-menu"
			changeSortRule={changeFolderSortRule}
			isInAscendingOrder={isFoldersInAscendingOrder}
			currentSortRule={folderSortRule}
		/>
	);
};

export default SortFolders;
