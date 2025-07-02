import classNames from "classnames";

import { TagIcon as TagIconSvg } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useShowTagIcon } from "src/hooks/useSettingsHandler";

const TagIcon = () => {
	const { plugin } = useExplorer();

	const { showTagIcon } = useShowTagIcon(plugin.settings.showTagIcon);

	if (!showTagIcon) return null;
	const className = classNames("ffs__tag-icon");

	return (
		<div className="ffs__tag-icon-wrapper">
			<TagIconSvg className={className} />
		</div>
	);
};

export default TagIcon;
