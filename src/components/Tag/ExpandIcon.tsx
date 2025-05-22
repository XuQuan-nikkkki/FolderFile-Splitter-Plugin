import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";
import ExpandIcon from "../ExpandIcon";
import { TagNode } from "src/store/tag";

type Props = {
	tag: TagNode;
};
const TagExpandIcon = ({ tag }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { hasTagChildren, expandedTagPaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasTagChildren: store.hasTagChildren,
			expandedTagPaths: store.expandedTagPaths,
		}))
	);

	const isTagExpanded = expandedTagPaths.includes(tag.fullPath);

	return (
		<ExpandIcon
			isExpanded={isTagExpanded}
			hideIcon={!hasTagChildren(tag)}
		/>
	);
};

export default TagExpandIcon;
