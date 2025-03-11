import { useShallow } from "zustand/react/shallow";

import { FILE_MANUAL_SORT_RULE, FileSortRule, FileTreeStore } from "src/store";
import SortAction from "../SortAction";
import { useFileTree } from "../FileTree";

type FileSortRuleItem = {
	text: string;
	rule: FileSortRule;
};
type FileSortRuleGroup = FileSortRuleItem[];
const FileSortByNameRules: FileSortRuleGroup = [
	{ text: "File name(A to Z)", rule: "FileNameAscending" },
	{ text: "File name(Z to A)", rule: "FileNameDescending" },
];
const FileSortByModifiedTimeRules: FileSortRuleGroup = [
	{
		text: "Modified time(new to old)",
		rule: "FileModifiedTimeDescending",
	},
	{
		text: "Modified time(old to new)",
		rule: "FileModifiedTimeAscending",
	},
];
const FileSortByCreatedTimeRules: FileSortRuleGroup = [
	{
		text: "Created time(new to old)",
		rule: "FileCreatedTimeDescending",
	},
	{
		text: "Created time(old to new)",
		rule: "FileCreatedTimeAscending",
	},
];
const FilesManualSortRules: FileSortRuleGroup = [
	{
		text: "Manual order",
		rule: "FileManualOrder",
	},
];

const SortFiles = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		fileSortRule,
		changeFileSortRule,
		isFilesInAscendingOrder,
		initFilesManualSortOrder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			fileSortRule: store.fileSortRule,
			isFilesInAscendingOrder: store.isFilesInAscendingOrder,
			changeFileSortRule: store.changeFileSortRule,
			initFilesManualSortOrder: store.initFilesManualSortOrder,
		}))
	);

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={[
				FileSortByNameRules,
				FileSortByModifiedTimeRules,
				FileSortByCreatedTimeRules,
				FilesManualSortRules,
			]}
			menuName="sort-files-menu"
			changeSortRule={async (rule) => {
				if (rule === FILE_MANUAL_SORT_RULE) {
					await initFilesManualSortOrder();
				}
				changeFileSortRule(rule);
			}}
			isInAscendingOrder={isFilesInAscendingOrder}
			currentSortRule={fileSortRule}
			isManualOrder={fileSortRule === FILE_MANUAL_SORT_RULE}
		/>
	);
};

export default SortFiles;
