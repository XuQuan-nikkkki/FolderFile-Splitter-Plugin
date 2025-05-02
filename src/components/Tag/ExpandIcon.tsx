import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useExpandFolderByClickingOnElement } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";
import ExpandIcon from "../ExpandIcon";
import { TagNode } from "src/store/tag";

type Props = {
	tag: TagNode;
};
const TagExpandIcon = ({ tag }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		hasTagChildren,
		expandedTagPaths,
		changeExpandedTagPaths,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasTagChildren: store.hasTagChildren,
			expandedTagPaths: store.expandedTagPaths,
			changeExpandedTagPaths: store.changeExpandedTagPaths,
		}))
	);

	const isTagExpanded = expandedTagPaths.includes(tag.fullPath);

	const { settings } = plugin;
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);

	const onToggleExpandState = (): void => {
		if (hasTagChildren(tag)) {
			const tagPaths = isTagExpanded
				? expandedTagPaths.filter((path) => path !== tag.fullPath)
				: [...expandedTagPaths, tag.fullPath];
				changeExpandedTagPaths(tagPaths);
		}
	};

	const onClickExpandIcon = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "icon") return;
		e.stopPropagation();
		onToggleExpandState();
	};

	return (
		<ExpandIcon
			isExpanded={isTagExpanded}
			hideIcon={!hasTagChildren(tag)}
			onClickExpandIcon={onClickExpandIcon}
		/>
	);
};

export default TagExpandIcon;
