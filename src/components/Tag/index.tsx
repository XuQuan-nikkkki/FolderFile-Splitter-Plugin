import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { TagNode } from "src/store/tag";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import TagExpandIcon from "./ExpandIcon";
import TagContent from "./Content";
import { ITEM_INFO_COPY, PUNCTUATION_COPY } from "src/locales";

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
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		hasTagChildren,
		setFocusedTag,
		focusedTag,
		getFilesInTag,
		getTagsByParent,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasTagChildren: store.hasTagChildren,
			setFocusedTag: store.setFocusedTag,
			focusedTag: store.focusedTag,
			getTagsByParent: store.getTagsByParent,
			getFilesInTag: store.getFilesInTag,
		}))
	);
	const isFocused = tag.fullPath == focusedTag?.fullPath;

	const getAriaLabel = () => {
		const filesCount = getFilesInTag(tag).length;
		const tagsCount = getTagsByParent(tag.fullPath).length;
		const { filesCountInTag, tagsCountInTag } = ITEM_INFO_COPY;

		const filesCountInfo =
			filesCount +
			" " +
			filesCountInTag[language] +
			(filesCount > 1 ? "s" : "");
		const tagsCountInfo =
			tagsCount +
			" " +
			tagsCountInTag[language] +
			(tagsCount > 1 ? "s" : "");

		return `${tag.name}\n${filesCountInfo}${PUNCTUATION_COPY.comma[language]}${tagsCountInfo}`;
	};

	const getIndentStyle = () => {
		if (disableHoverIndent) return undefined;
		const tagLevel = tag.fullPath.split("/").length - 1;
		return {
			marginInlineStart: -17 * tagLevel,
			paddingInlineStart: 24 + 17 * tagLevel,
		};
	};

	return (
		<div
			className={classNames(
				"ffs__folder-container tree-item-self nav-tag-title is-clickable",
				{
					"mod-collapsible": hasTagChildren(tag),
					"is-active": isFocused,
				}
			)}
			style={getIndentStyle()}
			onClick={() => setFocusedTag(tag)}
			data-tooltip-position="right"
			aria-label={getAriaLabel()}
		>
			{!hideExpandIcon && <TagExpandIcon tag={tag} />}
			<TagContent tag={tag} />
		</div>
	);
};

export default Tag;
