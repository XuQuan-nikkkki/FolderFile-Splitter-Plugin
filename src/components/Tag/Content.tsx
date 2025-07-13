import { Menu } from "obsidian";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { TagNode } from "src/store/tag";
import {
	addPinMenuItem,
	addRenameMenuItem,
	noop,
	triggerMenu,
} from "src/utils";

import { NameRef } from "../EditableName";
import TogglableContainer from "../TogglableContainer";

import TagFilesCount from "./FilesCount";
import TagName from "./Name";
import TagIcon from "./TagIcon";

type Props = {
	tag: TagNode;
};
const TagContent = ({ tag }: Props) => {
	const { plugin, useExplorerStore } = useExplorer();

	const {
		focusedTag,
		isTagPinned,
		pinTag,
		unpinTag,
		changeFocusedTag,
		toggleTag,
		deselectFocusedTag,
	} = useExplorerStore(
		useShallow((store) => ({
			focusedTag: store.focusedTag,
			isTagPinned: store.isTagPinned,
			pinTag: store.pinTag,
			unpinTag: store.unpinTag,
			changeFocusedTag: store.changeFocusedTag,
			toggleTag: store.toggleTag,
			deselectFocusedTag: store.deselectFocusedTag,
		}))
	);

	const nameRef = useRef<NameRef>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const isFocused = tag.fullPath === focusedTag?.fullPath;

	const addPinInMenu = (menu: Menu) => {
		const isPinned = isTagPinned(tag);
		addPinMenuItem(menu, {
			isPinned,
			pin: () => pinTag(tag),
			unpin: () => unpinTag(tag),
		});
	};

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		addPinInMenu(menu);
		menu.addSeparator();

		addRenameMenuItem(menu, nameRef.current?.onStartEditingName ?? noop);

		triggerMenu(plugin, menu, "tag-context-menu")(e);
	};

	const renderTitleContent = () => (
		<div className="ffs__tag-content--main" ref={contentRef}>
			<TagIcon />
			<TagName tag={tag} ref={nameRef} contentRef={contentRef} />
			<TagFilesCount tag={tag} />
		</div>
	);

	return (
		<TogglableContainer
			nameRef={nameRef}
			isFocused={isFocused}
			onSelect={() => changeFocusedTag(tag)}
			onDeselect={deselectFocusedTag}
			onToggleExpand={() => toggleTag(tag)}
			className="ffs__tag"
			onContextMenu={onShowContextMenu}
		>
			{renderTitleContent()}
		</TogglableContainer>
	);
};

export default TagContent;
