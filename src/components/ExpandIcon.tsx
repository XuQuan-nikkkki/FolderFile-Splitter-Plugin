import classNames from "classnames";

import { ChevronRight } from "src/assets/icons";

type Props = {
	isExpanded: boolean;
	hideIcon: boolean;
};
const ExpandIcon = ({ isExpanded, hideIcon }: Props) => {
	return (
		<div
			className={classNames("tree-item-icon collapse-icon", {
				"is-collapsed": !isExpanded,
			})}
		>
			{hideIcon ? null : (
				<ChevronRight className="ffs__expand-icon svg-icon right-triangle" />
			)}
		</div>
	);
};

export default ExpandIcon;
