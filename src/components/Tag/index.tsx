import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { TagNode } from "src/store/tag";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import TagExpandIcon from "./ExpandIcon";
import TagContent from "./Content";

type Props = {
	tag: TagNode;
	disableHoverIndent?: boolean;
	hideExpandIcon?: boolean;
};
const Tag = ({
	tag,
	disableHoverIndent = false,
	hideExpandIcon = false,
}: Props) => {
	const { useExplorerStore } = useExplorer();

	const { hasTagChildren } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasTagChildren: store.hasTagChildren,
		}))
	);

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
			{!hideExpandIcon && <TagExpandIcon tag={tag} />}
			<TagContent tag={tag} />
		</div>
	);
};

export default Tag;
