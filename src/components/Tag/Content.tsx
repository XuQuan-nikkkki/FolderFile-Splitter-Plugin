import classNames from "classnames";
import { Menu } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { TagNode } from "src/store/tag";
import { addPinMenuItem, addRenameMenuItem, triggerMenu } from "src/utils";

import TagFilesCount from "./FilesCount";
import TagIcon from "./TagIcon";

type Props = {
	tag: TagNode;
};
const TagContent = ({ tag }: Props) => {
	const { plugin, useExplorerStore } = useExplorer();

	const { renameTag, focusedTag, isTagPinned, pinTag, unpinTag } =
		useExplorerStore(
			useShallow((store) => ({
				renameTag: store.renameTag,
				focusedTag: store.focusedTag,
				isTagPinned: store.isTagPinned,
				pinTag: store.pinTag,
				unpinTag: store.unpinTag,
			}))
		);

	const isFocused = tag.fullPath == focusedTag?.fullPath;

	const onSaveName = (name: string) => renameTag(tag, name);
	const {
		renderEditableName: renderTagName,
		onStartEditingName,
		setIsFocusing,
		contentRef: tagRef,
	} = useRenderEditableName(tag.name, onSaveName, {
		className: "ffs__tag-name",
	});

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

		addRenameMenuItem(menu, onStartEditingName);

		triggerMenu(plugin, menu, "tag-context-menu")(e);
	};

	const renderTitleContent = () => (
		<div className="ffs__tag-content--main" ref={tagRef}>
			<TagIcon />
			{renderTagName()}
			<TagFilesCount tag={tag} />
		</div>
	);

	return (
		<div
			className={classNames("ffs__tag")}
			onContextMenu={onShowContextMenu}
			onClick={(e) => {
				if (isFocused) {
					tagRef.current?.focus();
					setIsFocusing(true);
				}
			}}
		>
			{renderTitleContent()}
		</div>
	);
};

export default TagContent;
