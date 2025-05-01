import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { TagNode } from "src/store/tag";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import TagExpandIcon from "./ExpandIcon";

type Props = {
	tag: TagNode;
};
const Tag = ({ tag }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { hasTagChildren } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasTagChildren: store.hasTagChildren,
		}))
	);
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
			{tag.name}
		</div>
	);
};

export default Tag;
