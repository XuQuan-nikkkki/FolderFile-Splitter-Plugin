import classNames from "classnames";

import { ChevronRight } from "src/assets/icons";

type IconProps = {
	isCollapsed: boolean;
	caller: () => void;
	label: string;
};
const ToggleIcon = ({ isCollapsed, caller, label }: IconProps) => (
	<div
		className={classNames(
			"ffs__action-button-wrapper ffs__collapse-pane-icon clickable-icon nav-action-button",
			{ "is-collapsed": isCollapsed }
		)}
		onClick={caller}
		data-tooltip-position="bottom"
		aria-label={label}
	>
		<ChevronRight className="ffs__action-button svg-icon" />
	</div>
);

type OpenPaneButtonProps = {
	onOpen: () => void;
	label: string;
};
export const OpenPaneButton = ({ onOpen, label }: OpenPaneButtonProps) => (
	<ToggleIcon isCollapsed={true} caller={onOpen} label={label} />
);

type ClosePaneButtonProps = {
	onClose: () => void;
	label: string;
};
export const ClosePaneButton = ({ onClose, label }: ClosePaneButtonProps) => (
	<ToggleIcon isCollapsed={false} caller={onClose} label={label} />
);
