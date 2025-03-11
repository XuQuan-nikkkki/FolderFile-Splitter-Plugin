import { useShallow } from "zustand/react/shallow";

import {
	FileTreeStore,
	FOLDER_MANUAL_SORT_RULE,
	FolderSortRule,
} from "src/store";
import SortAction from "../SortAction";
import { useFileTree } from "../FileTree";

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
const FolderManualSortRules: FolderSortRuleGroup = [
	{
		text: "Manual order",
		rule: "FolderManualOrder",
	},
];

const SortFolders = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		folderSortRule,
		changeFolderSortRule,
		isFoldersInAscendingOrder,
		initFoldersManualSortOrder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			folderSortRule: store.folderSortRule,
			isFoldersInAscendingOrder: store.isFoldersInAscendingOrder,
			changeFolderSortRule: store.changeFolderSortRule,
			initFoldersManualSortOrder: store.initFoldersManualSortOrder,
		}))
	);

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={[
				FolderSortByNameRules,
				FolderSortByFilesCountRules,
				FolderManualSortRules,
			]}
			menuName="sort-folders-menu"
			changeSortRule={(rule) => {
				if (rule === FOLDER_MANUAL_SORT_RULE) {
					initFoldersManualSortOrder();
				}
				changeFolderSortRule(rule);
			}}
			isInAscendingOrder={isFoldersInAscendingOrder}
			currentSortRule={folderSortRule}
			isManualOrder={folderSortRule === FOLDER_MANUAL_SORT_RULE}
		/>
	);
};

export default SortFolders;
