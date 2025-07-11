import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";
import { isZh, pluralize } from "src/utils";

import TagContent from "./Content";
import TagExpandIcon from "./ExpandIcon";

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

	const { hasSubTag, focusedTag, getFilesInTag, getTagsByParent } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				hasSubTag: store.hasSubTag,
				focusedTag: store.focusedTag,
				getTagsByParent: store.getTagsByParent,
				getFilesInTag: store.getFilesInTag,
				// for dependency tracking only
				expandedTagPaths: store.expandedTagPaths,
			}))
		);

	const isFocused = tag.fullPath == focusedTag?.fullPath;

	const getAriaLabel = () => {
		const { name } = tag;
		const filesCount = getFilesInTag(tag).length;
		const tagsCount = getTagsByParent(tag.fullPath).length;

		if (isZh) return `${name}\n${filesCount} 条笔记，${tagsCount} 个标签`;
		return `${name}\n${pluralize(filesCount, "file")}, ${pluralize(
			tagsCount,
			"tag"
		)}`;
	};

	const getIndentStyle = () => {
		if (disableHoverIndent) return undefined;
		const tagLevel = tag.fullPath.split("/").length - 1;
		return {
			marginInlineStart: -17 * tagLevel,
			paddingInlineStart: 24 + 17 * tagLevel,
		};
	};

	const getClassNames = () => {
		return classNames(
			"ffs__folder-container tree-item-self nav-folder-title is-clickable",
			{
				"mod-collapsible": hasSubTag(tag),
				"is-active": isFocused,
			}
		);
	};

	return (
		<div
			className={getClassNames()}
			style={getIndentStyle()}
			data-tooltip-position="right"
			aria-label={getAriaLabel()}
		>
			{!hideExpandIcon && <TagExpandIcon tag={tag} />}
			<TagContent tag={tag} />
		</div>
	);
};

export default Tag;
