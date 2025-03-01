import { useEffect } from "react";
import { Menu } from "obsidian";

import { AscendingSortIcon, DescendingSortIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";

type SortRule = {
	text: string;
	rule: string;
};
type SortRuleGroup = SortRule[];

type Props = {
	plugin: FolderFileSplitterPlugin;
	restoreSortRule: () => void;
	ruleGroups: SortRuleGroup[];
	menuName: string;
	changeSortRule: (rule: string) => void;
	isInAscendingOrder: () => boolean;
	currentSortRule: string;
};
const SortAction = ({
	plugin,
	restoreSortRule,
	ruleGroups,
	menuName,
	changeSortRule,
	isInAscendingOrder,
	currentSortRule,
}: Props) => {
	useEffect(() => {
		restoreSortRule();
	}, []);

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

	const icon = isInAscendingOrder() ? (
		<AscendingSortIcon />
	) : (
		<DescendingSortIcon />
	);
	return (
		<div className="ffs-actions-icon-wrapper" onClick={onChangeSortRule}>
			{icon}
		</div>
	);
};

export default SortAction;
