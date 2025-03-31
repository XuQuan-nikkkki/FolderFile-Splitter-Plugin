import { useShallow } from "zustand/react/shallow";

import { FILE_MANUAL_SORT_RULE, FileSortRule, FileTreeStore } from "src/store";
import SortAction from "../SortAction";
import { useFileTree } from "../FileTree";
import { ManualSortFilesModal } from "../ManualSortFilesModal";
import { FILE_SORT_RULES_COPY } from "src/locales";

type FileSortRuleItem = {
	text: string;
	rule: FileSortRule;
};
type FileSortRuleGroup = FileSortRuleItem[];

const SortFiles = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const { language } = plugin;

	const {
		fileSortRule,
		changeFileSortRule,
		isFilesInAscendingOrder,
		initFilesManualSortOrder,
		focusedFolder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			fileSortRule: store.fileSortRule,
			isFilesInAscendingOrder: store.isFilesInAscendingOrder,
			changeFileSortRule: store.changeFileSortRule,
			initFilesManualSortOrder: store.initFilesManualSortOrder,
			focusedFolder: store.focusedFolder,
		}))
	);

	const getRuleGroups = () => {
		const {
			fileNameAscending,
			fileNameDescending,
			modifiledTimeAscending,
			modifiledTimeDescending,
			createdTimeAscending,
			createdTimeDescending,
			manualOrder,
		} = FILE_SORT_RULES_COPY;
		const fileSortByNameRules: FileSortRuleGroup = [
			{ text: fileNameAscending[language], rule: "FileNameAscending" },
			{ text: fileNameDescending[language], rule: "FileNameDescending" },
		];
		const fileSortByModifiedTimeRules: FileSortRuleGroup = [
			{
				text: modifiledTimeDescending[language],
				rule: "FileModifiedTimeDescending",
			},
			{
				text: modifiledTimeAscending[language],
				rule: "FileModifiedTimeAscending",
			},
		];
		const fileSortByCreatedTimeRules: FileSortRuleGroup = [
			{
				text: createdTimeDescending[language],
				rule: "FileCreatedTimeDescending",
			},
			{
				text: createdTimeAscending[language],
				rule: "FileCreatedTimeAscending",
			},
		];
		const filesManualSortRules: FileSortRuleGroup = [
			{
				text: manualOrder[language],
				rule: "FileManualOrder",
			},
		];

		return [
			fileSortByNameRules,
			fileSortByModifiedTimeRules,
			fileSortByCreatedTimeRules,
			filesManualSortRules,
		];
	};

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={getRuleGroups()}
			menuName="sort-files-menu"
			changeSortRule={async (rule) => {
				if (rule === FILE_MANUAL_SORT_RULE) {
					await initFilesManualSortOrder();
					if (focusedFolder) {
						const modal = new ManualSortFilesModal(
							plugin,
							focusedFolder,
							useFileTreeStore
						);
						modal.open();
					}
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
