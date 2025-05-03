import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import SortAction from "../SortAction";
import { ManualSortFoldersModal } from "../ManualSortFoldersModal";
import { FOLDER_SORT_RULES_COPY } from "src/locales";
import { useExplorer } from "src/hooks/useExplorer";
import { FOLDER_MANUAL_SORT_RULE, FolderSortRule } from "src/store/folder";

type FolderSortRuleItem = {
	text: string;
	rule: FolderSortRule;
};
type FolderSortRuleGroup = FolderSortRuleItem[];

const SortFolders = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		folderSortRule,
		changeFolderSortRule,
		isFoldersInAscendingOrder,
		initFoldersManualSortOrder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			folderSortRule: store.folderSortRule,
			isFoldersInAscendingOrder: store.isFoldersInAscendingOrder,
			changeFolderSortRule: store.changeFolderSortRule,
			initFoldersManualSortOrder: store.initFoldersManualSortOrder,
		}))
	);

	const getRuleGroups = () => {
		const {
			folderNameAscending,
			folderNameDescending,
			filesCountAscending,
			filesCountDescending,
			manualOrder,
		} = FOLDER_SORT_RULES_COPY;
		const folderSortByNameRules: FolderSortRuleGroup = [
			{
				text: folderNameAscending[language],
				rule: "FolderNameAscending",
			},
			{
				text: folderNameDescending[language],
				rule: "FolderNameDescending",
			},
		];
		const folderSortByFilesCountRules: FolderSortRuleGroup = [
			{
				text: filesCountAscending[language],
				rule: "FilesCountAscending",
			},
			{
				text: filesCountDescending[language],
				rule: "FilesCountDescending",
			},
		];
		const folderManualSortRules: FolderSortRuleGroup = [
			{
				text: manualOrder[language],
				rule: "FolderManualOrder",
			},
		];
		return [
			folderSortByNameRules,
			folderSortByFilesCountRules,
			folderManualSortRules,
		];
	};

	const onChangeSortRule = (rule: FolderSortRule) => {
		if (rule === FOLDER_MANUAL_SORT_RULE) {
			initFoldersManualSortOrder();
			const modal = new ManualSortFoldersModal(
				plugin,
				plugin.app.vault.getRoot(),
				useExplorerStore
			);
			modal.open();
		}
		if (rule !== folderSortRule) {
			changeFolderSortRule(rule as FolderSortRule);
		}
	};

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={getRuleGroups()}
			menuName="sort-folders-menu"
			changeSortRule={onChangeSortRule}
			isInAscendingOrder={isFoldersInAscendingOrder}
			currentSortRule={folderSortRule}
			isManualOrder={folderSortRule === FOLDER_MANUAL_SORT_RULE}
		/>
	);
};

export default SortFolders;
