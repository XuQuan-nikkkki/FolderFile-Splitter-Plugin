import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { FOLDER_SORT_RULES_COPY, SORT_TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";
import { FOLDER_MANUAL_SORT_RULE, FolderSortRule } from "src/store/folder/sort";

import { ManualSortFoldersModal } from "../ManualSortFoldersModal";
import SortAction from "../SortAction";

const SortFolders = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		folderSortRule,
		folderSortRulesGroup,
		changeFolderSortRuleAndUpdateOrder,
		rootFolder,
		initFoldersOrder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			folderSortRule: store.folderSortRule,
			folderSortRulesGroup: store.folderSortRulesGroup,
			changeFolderSortRuleAndUpdateOrder:
				store.changeFolderSortRuleAndUpdateOrder,
			rootFolder: store.rootFolder,
			initFoldersOrder: store.initFoldersManualSortOrder,
		}))
	);

	const getRuleGroups = () =>
		folderSortRulesGroup.map((rules) =>
			rules.map((rule) => ({
				rule,
				text: FOLDER_SORT_RULES_COPY[rule][language],
			}))
		);

	const onChangeSortRule = async (rule: FolderSortRule) => {
		if (rule === FOLDER_MANUAL_SORT_RULE) {
			await initFoldersOrder();
			const modal = new ManualSortFoldersModal(
				plugin,
				useExplorerStore,
				rootFolder
			);
			modal.open();
		}
		await changeFolderSortRuleAndUpdateOrder(rule);
	};

	return (
		<SortAction
			ruleGroups={getRuleGroups()}
			menuName="sort-folders-menu"
			changeSortRule={onChangeSortRule}
			currentSortRule={folderSortRule}
			data-tooltip-position="bottom"
			aria-label={SORT_TIPS_COPY.sortFoldersAndTags[language]}
		/>
	);
};

export default SortFolders;
