import { useShowTagIcon } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";
import classNames from "classnames";
import { TagIcon } from "src/assets/icons";
import { TagNode } from "src/store/tag";
import FilesCount from "./FilesCount";
import { useShallow } from "zustand/react/shallow";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { useEffect, useRef, useState } from "react";
import { Menu } from "obsidian";
import { TAG_OPERATION_COPY } from "src/locales";

type Props = {
	tag: TagNode;
};
const TagContent = ({ tag }: Props) => {
	const { plugin, useExplorerStore } = useExplorer();
	const { language } = plugin;

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

	const tagRef = useRef<HTMLDivElement>(null);
	const [isFocusing, setIsFocusing] = useState<boolean>(false);

	const { showTagIcon } = useShowTagIcon(plugin.settings.showTagIcon);

	const isFocused = tag.fullPath == focusedTag?.fullPath;

	const onSaveName = (name: string) => renameTag(tag, name);
	const {
		renderEditableName: renderTagName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(tag.name, onSaveName, {
		className: "ffs__tag-name",
	});

	const onClickOutside = (event: MouseEvent) => {
		if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
			setIsFocusing(false);
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && isFocusing) {
			onBeginEdit();
			setTimeout(() => {
				selectFileNameText();
			}, 100);
		}
	};

	// const onStartEditingName = () => {
	// 	onBeginEdit();
	// 	setTimeout(() => {
	// 		selectFileNameText();
	// 	}, 100);
	// };

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [isFocusing]);

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		menu.addItem((item) => {
			const isPinned = isTagPinned(tag.fullPath);
			item.setIcon(isPinned ? "pin-off" : "pin");
			const title = isPinned
				? TAG_OPERATION_COPY.unpinTag[language]
				: TAG_OPERATION_COPY.pinTag[language];
			item.setTitle(title);
			item.onClick(() => {
				if (isPinned) {
					unpinTag(tag.fullPath);
				} else {
					pinTag(tag.fullPath);
				}
			});
		});
		plugin.app.workspace.trigger("tag-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const maybeRenderTagIcon = () => {
		if (!showTagIcon) return null;
		const className = classNames("ffs__tag-icon");

		return (
			<div className="ffs__tag-icon-wrapper">
				<TagIcon className={className} />
			</div>
		);
	};

	const renderTitleContent = () => (
		<div className="ffs__tag-content--main" ref={tagRef}>
			{maybeRenderTagIcon()}
			{renderTagName()}
			<FilesCount tag={tag} />
		</div>
	);

	return (
		<div
			className={classNames("ffs__tag")}
			onContextMenu={onShowContextMenu}
			onClick={(e) => {
				if (isFocused) {
					e.stopPropagation();
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
