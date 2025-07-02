import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowHierarchyLines,
} from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import Tag from "../Tag";

export const SUB_ITEMS_CLASSNAMES = "tree-item-children nav-folder-children";
export const getSubItemsStyle = (showHierarchyLines: boolean) => ({
	borderInlineStart: showHierarchyLines ? undefined : "none",
});

type Props = {
	tag: TagNode;
	index: number;
};
const TagTreeItem = ({ tag, index }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		sortTags,
		isTagExpanded,
		getTagsByParent,
		hasSubTag,
		isTopLevelTag,
		isFocusedTag,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			sortTags: store.sortTags,
			isTagExpanded: store.isTagExpanded,
			getTagsByParent: store.getTagsByParent,
			hasSubTag: store.hasSubTag,
			isTopLevelTag: store.isTopLevelTag,
			isFocusedTag: store.isFocusedTag,

			// for dependency tracking only
			expandedTagPaths: store.expandedTagPaths,
		}))
	);

	const {
		showFolderHierarchyLines: defaultShowLines,
		showFolderView: defaultShowFolderView,
	} = plugin.settings;
	const { showHierarchyLines } = useShowHierarchyLines(defaultShowLines);
	const { showFolderView } = useShowFolderView(defaultShowFolderView);

	const isExpanded = isTagExpanded(tag);
	const subTags = sortTags(getTagsByParent(tag.fullPath));
	const showSubTags = isExpanded && hasSubTag(tag);

	const renderSubTags = () => {
		if (!showSubTags) return null;
		return (
			<div
				className={`ffs__sub-tags-group ${SUB_ITEMS_CLASSNAMES}`}
				style={getSubItemsStyle(showHierarchyLines)}
			>
				{subTags.map((tag, index) => (
					<TagTreeItem tag={tag} index={index} key={tag.fullPath} />
				))}
			</div>
		);
	};

	const getClassNames = () =>
		classNames("ffs__tag-tree-item tree-item nav-folder", {
			"is-collapsed": !isExpanded && isFocusedTag(tag),
			"ffs__tag-tree--start":
				index === 0 && showFolderView && isTopLevelTag(tag),
		});

	return (
		<div key={tag.name} className={getClassNames()}>
			<Tag key={tag.name} tag={tag} />
			{renderSubTags()}
		</div>
	);
};

export default TagTreeItem;
