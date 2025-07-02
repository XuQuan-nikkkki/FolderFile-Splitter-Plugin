import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { FILE_SORT_RULES_COPY, SORT_TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";
import { FILE_MANUAL_SORT_RULE } from "src/store/file/sort";
import { FileSortRule } from "src/store/file/sort";

import { ManualSortFilesModal } from "../ManualSortFilesModal";
import SortAction from "../SortAction";

const SortFiles = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		fileSortRule,
		focusedFolder,
		filesSortRulesGroup,
		changeFileSortRuleAndUpdateOrder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			fileSortRule: store.fileSortRule,
			focusedFolder: store.focusedFolder,
			filesSortRulesGroup: store.filesSortRulesGroup,
			changeFileSortRuleAndUpdateOrder:
				store.changeFileSortRuleAndUpdateOrder,
		}))
	);

	const getRuleGroups = () =>
		filesSortRulesGroup.map((rules) =>
			rules.map((rule) => ({
				rule,
				text: FILE_SORT_RULES_COPY[rule][language],
			}))
		);

	const onChangeSortRule = async (rule: FileSortRule) => {
		if (rule === FILE_MANUAL_SORT_RULE) {
			const modal = new ManualSortFilesModal(
				plugin,
				useExplorerStore,
				focusedFolder
			);
			modal.open();
		}
		await changeFileSortRuleAndUpdateOrder(rule);
	};

	return (
		<SortAction
			ruleGroups={getRuleGroups()}
			menuName="sort-files-menu"
			changeSortRule={onChangeSortRule}
			currentSortRule={fileSortRule}
			data-tooltip-position="bottom"
			aria-label={SORT_TIPS_COPY.sortFiles[language]}
		/>
	);
};

export default SortFiles;
