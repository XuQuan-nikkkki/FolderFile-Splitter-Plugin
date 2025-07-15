import classNames from "classnames";
import { Menu } from "obsidian";

import { ACTION_BUTTON_WRAPPER_CLASS_NAME } from "src/assets/constants";
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
	disabled?: boolean;
};
const SortAction = ({
	ruleGroups,
	menuName,
	changeSortRule,
	currentSortRule,
	disabled = false,
	...props
}: Props) => {
	const { plugin } = useExplorer();

	const onChangeSortRule = (e: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) return;

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

	const getClassNames = () => {
		return classNames(ACTION_BUTTON_WRAPPER_CLASS_NAME, {
			"ffs__action-button-wrapper--disabled": disabled,
		});
	};

	return (
		<div className={getClassNames()} onClick={onChangeSortRule} {...props}>
			{renderIcon()}
		</div>
	);
};

export default SortAction;
