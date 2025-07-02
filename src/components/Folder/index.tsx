import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { FFS_DRAG_FILE, FFS_DRAG_FOLDER } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { getIndentStyle } from "src/utils";

import { FolderProps } from "./Content";
import FolderDraggableContent from "./DraggableContent";
import FolderExpandIcon from "./ExpandIcon";
import { getPopupInfo } from "./popupInfo";

type Props = FolderProps & {
	disableDrag?: boolean;
	hideExpandIcon?: boolean;
	disableHoverIndent?: boolean;
};
const Folder = ({
	folder,
	hideExpandIcon = false,
	disableDrag = false,
	disableHoverIndent = false,
}: Props) => {
	const { useExplorerStore } = useExplorer();

	const {
		changeFocusedFolder,
		expandFolder,
		toggleFolder,
		focusedFolder,
		hasSubFolder,
		getFilesinFolder,
		getSubFolders,
		getFolderLevel,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			changeFocusedFolder: store.changeFocusedFolder,
			hasSubFolder: store.hasSubFolder,
			expandFolder: store.expandFolder,
			toggleFolder: store.toggleFolder,
			focusedFolder: store.focusedFolder,
			getFilesinFolder: store.getFilesInFolder,
			getSubFolders: store.getSubFolders,
			getFolderLevel: store.getFolderLevel,

			// for dependency tracking only
			expandedFolderPaths: store.expandedFolderPaths,
		}))
	);

	const isFocused = folder.path == focusedFolder?.path;
	const isRoot = folder.isRoot();

	const { setNodeRef: setDropRef, isOver } = useDroppable({
		id: `drop-${folder.path}`,
		data: {
			accepts: [FFS_DRAG_FILE, FFS_DRAG_FOLDER],
			item: folder,
		},
		disabled: disableDrag,
	});

	useEffect(() => {
		if (!isOver) return;
		const timer = setTimeout(() => {
			expandFolder(folder);
		}, 800);
		return () => clearTimeout(timer);
	}, [isOver]);

	const maybeRenderExpandIcon = () => {
		if (isRoot || hideExpandIcon) return null;
		return <FolderExpandIcon folder={folder} />;
	};

	const getAriaLabel = () => {
		const filesCount = getFilesinFolder(folder).length;
		const foldersCount = getSubFolders(folder).length;
		return getPopupInfo(folder, foldersCount, filesCount);
	};

	const getClassNames = () => {
		return classNames(
			"ffs__folder-container tree-item-self nav-folder-title is-clickable",
			{
				"mod-collapsible": hasSubFolder(folder),
				"is-active": isFocused,
				"ffs__is-over": isOver && !disableDrag,
			}
		);
	};

	return (
		<div
			className={getClassNames()}
			ref={setDropRef}
			onClick={async () => {
				toggleFolder(folder);
				await changeFocusedFolder(folder);
			}}
			style={getIndentStyle(getFolderLevel(folder), disableHoverIndent)}
			data-tooltip-position="right"
			aria-label={getAriaLabel()}
		>
			{maybeRenderExpandIcon()}
			<FolderDraggableContent folder={folder} disableDrag={disableDrag} />
		</div>
	);
};

export default Folder;
