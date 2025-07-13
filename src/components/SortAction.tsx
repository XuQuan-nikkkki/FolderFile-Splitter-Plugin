import { Menu } from "obsidian";

import {
	ArrowUpDownIcon,
	AscendingSortIcon,
	DescendingSortIcon,
} from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import {
	addMenuItem,
	isInAscendingOrderRule,
	isManualSortOrderRule,
	SortRule,
	triggerMenu,
} from "src/utils";

type RuleCopy = {
	text: string;
	rule: string;
	disabled?: boolean;
};
type SortRuleGroup = RuleCopy[];

type Props = {
	ruleGroups: SortRuleGroup[];
	menuName: string;
	changeSortRule: (rule: string) => void;
	currentSortRule: SortRule;
};
const SortAction = ({
	ruleGroups,
	menuName,
	changeSortRule,
	currentSortRule,
	...props
}: Props) => {
	const { plugin } = useExplorer();

	const onChangeSortRule = (e: React.MouseEvent<HTMLDivElement>) => {
		const menu = new Menu();
		ruleGroups.forEach((rules) => {
			rules.forEach(({ text, rule, disabled }) => {
				addMenuItem(menu, {
					title: text,
					checked: rule === currentSortRule,
					disabled,
					action: () => changeSortRule(rule),
				});
			});
			menu.addSeparator();
		});
		triggerMenu(plugin, menu, menuName)(e);
	};

	const renderIcon = () => {
		const actionButtonClassName = "ffs__action-button svg-icon";
		if (isManualSortOrderRule(currentSortRule)) {
			return <ArrowUpDownIcon className={actionButtonClassName} />;
		}
		return isInAscendingOrderRule(currentSortRule) ? (
			<AscendingSortIcon className={actionButtonClassName} />
		) : (
			<DescendingSortIcon className={actionButtonClassName} />
		);
	};

	return (
		<div
			className="ffs__action-button-wrapper clickable-icon nav-action-button"
			onClick={onChangeSortRule}
			{...props}
		>
			{renderIcon()}
		</div>
	);
};

export default SortAction;
