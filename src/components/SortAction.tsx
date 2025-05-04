import { Menu } from "obsidian";

import {
	ArrowUpDownIcon,
	AscendingSortIcon,
	DescendingSortIcon,
} from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";

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
	...props
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
		const actionButtonClassName = "ffs__action-button svg-icon";
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
