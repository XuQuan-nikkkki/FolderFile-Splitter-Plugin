import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { TagNode } from "src/store/tag";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import TagExpandIcon from "./ExpandIcon";
import { useShowTagIcon } from "src/hooks/useSettingsHandler";
import { TagIcon } from "src/assets/icons";

type Props = {
	tag: TagNode;
};
const Tag = ({ tag }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { hasTagChildren } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasTagChildren: store.hasTagChildren,
		}))
	);

	const { showTagIcon } = useShowTagIcon(plugin.settings.showTagIcon);

	const maybeRenderTagIcon = () => {
		if (!showTagIcon) return null;
		const className = classNames("ffs__tag-icon");

		return (
			<div className="ffs__tag-icon-wrapper">
				<TagIcon className={className} />
			</div>
		);
	};

	return (
		<div
			className={classNames(
				"ffs__folder-container tree-item-self nav-tag-title is-clickable",
				{
					"mod-collapsible": hasTagChildren(tag),
				}
			)}
		>
			<TagExpandIcon tag={tag} />
			{maybeRenderTagIcon()}
			{tag.name}
		</div>
	);
};

export default Tag;
