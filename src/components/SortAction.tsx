import { Menu } from "obsidian";

import {
	ArrowUpDownIcon,
	AscendingSortIcon,
	DescendingSortIcon,
} from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { StyledActionButtonWrapper } from "./layout/Actions";

type SortRule = {
	text: string;
	rule: string;
};
type SortRuleGroup = SortRule[];

type Props = {
	plugin: FolderFileSplitterPlugin;
	ruleGroups: SortRuleGroup[];
	menuName: string;
	changeSortRule: (rule: string) => void;
	isInAscendingOrder: () => boolean;
	currentSortRule: string;
	isManualOrder: boolean;
};
const SortAction = ({
	plugin,
	ruleGroups,
	menuName,
	changeSortRule,
	isInAscendingOrder,
	currentSortRule,
	isManualOrder,
}: Props) => {
	const onChangeSortRule = (e: React.MouseEvent<HTMLDivElement>) => {
		const menu = new Menu();
		ruleGroups.forEach((rules) => {
			rules.forEach(({ text, rule }) => {
				menu.addItem((newItem) => {
					newItem
						.setTitle(text)
						.setChecked(rule === currentSortRule)
						.onClick(() => {
							changeSortRule(rule);
						});
				});
			});
			menu.addSeparator();
		});
		plugin.app.workspace.trigger(menuName, menu);
		menu.showAtPosition({ x: e.pageX, y: e.pageY });
		return false;
	};

	const renderIcon = () => {
		const actionButtonClassName = "ffs__action-button"
		if (isManualOrder) {
			return <ArrowUpDownIcon className={actionButtonClassName} />;
		}
		return isInAscendingOrder() ? (
			<AscendingSortIcon className={actionButtonClassName} />
		) : (
			<DescendingSortIcon className={actionButtonClassName} />
		);
	};

	return (
		<StyledActionButtonWrapper onClick={onChangeSortRule}>
			{renderIcon()}
		</StyledActionButtonWrapper>
	);
};

export default SortAction;
