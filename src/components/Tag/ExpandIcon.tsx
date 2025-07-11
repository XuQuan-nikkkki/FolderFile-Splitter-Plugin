import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import ExpandIcon from "../ExpandIcon";

type Props = {
	tag: TagNode;
};
const TagExpandIcon = ({ tag }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { hasSubTag, isTagExpanded, toggleTag } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasSubTag: store.hasSubTag,
			isTagExpanded: store.isTagExpanded,
			toggleTag: store.toggleTag,
		}))
	);

	return (
		<ExpandIcon
			isExpanded={isTagExpanded(tag)}
			hideIcon={!hasSubTag(tag)}
			onToggle={() => toggleTag(tag)}
		/>
	);
};

export default TagExpandIcon;
