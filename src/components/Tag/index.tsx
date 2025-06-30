import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";
import { pluralize } from "src/utils";

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
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		hasSubTag,
		setFocusedTag,
		focusedTag,
		getFilesInTag,
		getTagsByParent,
		expandedTagPaths,
		collapseTag,
		expandTag,
		changeViewMode,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasSubTag: store.hasSubTag,
			setFocusedTag: store.setFocusedTag,
			focusedTag: store.focusedTag,
			getTagsByParent: store.getTagsByParent,
			getFilesInTag: store.getFilesInTag,
			expandedTagPaths: store.expandedTagPaths,
			collapseTag: store.collapseTag,
			expandTag: store.expandTag,
			changeViewMode: store.changeViewMode,
		}))
	);

	const isFocused = tag.fullPath == focusedTag?.fullPath;

	const onToggleExpandState = (): void => {
		const isFolderExpanded = expandedTagPaths.includes(tag.fullPath);
		if (isFolderExpanded) {
			collapseTag(tag);
		} else {
			expandTag(tag);
		}
	};

	const onToggleSelectState = async (): Promise<void> => {
		if (isFocused) {
			setFocusedTag(null);
			await changeViewMode("all");
		} else {
			setFocusedTag(tag);
			await changeViewMode("tag");
		}
	};

	const getAriaLabel = () => {
		const { name } = tag;
		const filesCount = getFilesInTag(tag).length;
		const tagsCount = getTagsByParent(tag.fullPath).length;

		if (language === "en") {
			return `${name}\n${pluralize(filesCount, "file")}, ${pluralize(
				tagsCount,
				"tag"
			)}`;
		}
		return `${name}\n${filesCount} 条笔记，${tagsCount} 个标签`;
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
			onClick={async () => {
				onToggleExpandState();
				await onToggleSelectState();
			}}
			data-tooltip-position="right"
			aria-label={getAriaLabel()}
		>
			{!hideExpandIcon && <TagExpandIcon tag={tag} />}
			<TagContent tag={tag} />
		</div>
	);
};

export default Tag;
