import { useShallow } from "zustand/react/shallow";

import { FILE_MANUAL_SORT_RULE, FileSortRule, ExplorerStore } from "src/store";
import { FILE_SORT_RULES_COPY } from "src/locales";
import { useExplorer } from "src/hooks/useExplorer";

import { ManualSortFilesModal } from "../ManualSortFilesModal";
import SortAction from "../SortAction";

type FileSortRuleItem = {
	text: string;
	rule: FileSortRule;
};
type FileSortRuleGroup = FileSortRuleItem[];

const SortFiles = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const { language } = plugin;

	const {
		fileSortRule,
		changeFileSortRule,
		isFilesInAscendingOrder,
		initFilesManualSortOrder,
		focusedFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
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
							useExplorerStore
						);
						modal.open();
					}
				}
				changeFileSortRule(rule as FileSortRule);
			}}
			isInAscendingOrder={isFilesInAscendingOrder}
			currentSortRule={fileSortRule}
			isManualOrder={fileSortRule === FILE_MANUAL_SORT_RULE}
		/>
	);
};

export default SortFiles;
