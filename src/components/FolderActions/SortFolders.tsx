import { useShallow } from "zustand/react/shallow";

import {
	FileTreeStore,
	FOLDER_MANUAL_SORT_RULE,
	FolderSortRule,
} from "src/store";
import SortAction from "../SortAction";
import { useFileTree } from "../FileTree";
import { ManualSortFoldersModal } from "../ManualSortFoldersModal";
import { FOLDER_SORT_RULES_COPY } from "src/locales";

type FolderSortRuleItem = {
	text: string;
	rule: FolderSortRule;
};
type FolderSortRuleGroup = FolderSortRuleItem[];

const SortFolders = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const { language } = plugin;

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

	return (
		<SortAction
			plugin={plugin}
			ruleGroups={getRuleGroups()}
			menuName="sort-folders-menu"
			changeSortRule={(rule) => {
				if (rule === FOLDER_MANUAL_SORT_RULE) {
					initFoldersManualSortOrder();
					const modal = new ManualSortFoldersModal(
						plugin,
						plugin.app.vault.getRoot(),
						useFileTreeStore
					);
					modal.open();
				}
				if (rule !== folderSortRule) {
					changeFolderSortRule(rule);
				}
			}}
			isInAscendingOrder={isFoldersInAscendingOrder}
			currentSortRule={folderSortRule}
			isManualOrder={folderSortRule === FOLDER_MANUAL_SORT_RULE}
		/>
	);
};

export default SortFolders;
