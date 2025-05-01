import { ReactNode } from "react";
import classNames from "classnames";

import { ChevronRight } from "src/assets/icons";

type Props = {
	isExpanded: boolean;
	hideIcon: boolean;
	onClickExpandIcon: (e: React.MouseEvent<HTMLDivElement>) => void;
};
const ExpandIcon = ({ isExpanded, hideIcon, onClickExpandIcon }: Props) => {
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
			onClick={onClickExpandIcon}
		>
			{content}
		</div>
	);
};

export default ExpandIcon;
