import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileSortRule, FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import SortAction from "../SortAction";

type FileSortRuleItem = {
	text: string;
	rule: FileSortRule;
};
type FileSortRuleGroup = FileSortRuleItem[];
const FileSortByNameRules: FileSortRuleGroup = [
	{ text: "Folder name(A to Z)", rule: "FileNameAscending" },
	{ text: "Folder name(Z to A)", rule: "FileNameDescending" },
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

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const SortFiles = ({ useFileTreeStore, plugin }: Props) => {
	const {
		fileSortRule,
		changeFileSortRule,
		isFilesInAscendingOrder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			fileSortRule: store.fileSortRule,
			isFilesInAscendingOrder: store.isFilesInAscendingOrder,
			changeFileSortRule: store.changeFileSortRule,
		}))
	);

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={[
				FileSortByNameRules,
				FileSortByModifiedTimeRules,
				FileSortByCreatedTimeRules,
			]}
			menuName="sort-files-menu"
			changeSortRule={changeFileSortRule}
			isInAscendingOrder={isFilesInAscendingOrder}
			currentSortRule={fileSortRule}
		/>
	);
};

export default SortFiles;
