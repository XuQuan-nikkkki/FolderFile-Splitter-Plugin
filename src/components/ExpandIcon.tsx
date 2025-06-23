import classNames from "classnames";
import { ReactNode } from "react";

import { ChevronRight } from "src/assets/icons";

type Props = {
	isExpanded: boolean;
	hideIcon: boolean;
};
const ExpandIcon = ({ isExpanded, hideIcon }: Props) => {
	let content: ReactNode;
	if (hideIcon) {
		content = null;
	} else {
		content = (
			<ChevronRight className="ffs__expand-icon svg-icon right-triangle" />
		);
	}

	return (
		<div
			className={classNames("tree-item-icon collapse-icon", {
				"is-collapsed": !isExpanded,
			})}
		>
			{content}
		</div>
	);
};

export default ExpandIcon;
