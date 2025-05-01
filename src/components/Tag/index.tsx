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
	disableHoverIndent?: boolean;
};
const Tag = ({ tag, disableHoverIndent = false }: Props) => {
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

	const tagLevel = tag.fullPath.split("/").length - 1;
	return (
		<div
			className={classNames(
				"ffs__folder-container tree-item-self nav-tag-title is-clickable",
				{
					"mod-collapsible": hasTagChildren(tag),
				}
			)}
			style={
				disableHoverIndent
					? undefined
					: {
							marginInlineStart: -17 * tagLevel,
							paddingInlineStart: 24 + 17 * tagLevel,
						}
			}
		>
			<TagExpandIcon tag={tag} />
			{maybeRenderTagIcon()}
			{tag.name}
		</div>
	);
};

export default Tag;
