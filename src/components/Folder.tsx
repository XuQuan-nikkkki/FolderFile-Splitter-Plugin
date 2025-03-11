import { TAbstractFile, TFile, TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";
import { useEffect, useRef } from "react";

import { FileTreeStore } from "src/store";
import { FFS_FILE, FFS_FOLDER } from "src/assets/constants";
import FolderContent, { FolderProps } from "./FolderContent";
import { Draggable } from "./Styled/Sortable";
import { moveFileOrFolder } from "src/utils";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useFileTree } from "./FileTree";

type Props = FolderProps & {
	disableDrag?: boolean;
};
const Folder = ({
	folder,
	isRoot = false,
	hideExpandIcon = false,
	disableDrag = false,
}: Props) => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		setFocusedFolder,
		hasFolderChildren,
		expandedFolderPaths,
		changeExpandedFolderPaths,
		selectFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			folderSortRule: store.folderSortRule,
			setFocusedFolder: store.setFocusedFolder,
			hasFolderChildren: store.hasFolderChildren,
			expandedFolderPaths: store.expandedFolderPaths,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			selectFile: store.selectFile,
		}))
	);

	const folderRef = useRef<HTMLDivElement>(null);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);
	const onToggleExpandState = (): void => {
		if (isRoot) return;
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: [...expandedFolderPaths, folder.path];
			changeExpandedFolderPaths(folderPaths);
		}
	};

	const [{ isDragging }, drag, preview] = useDrag(() => ({
		type: FFS_FOLDER,
		item: folder,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		canDrag: !disableDrag,
	}));

	const onDrop = async (item: TAbstractFile, itemType: string) => {
		if (item.parent?.path === folder.path) return;
		await moveFileOrFolder(plugin.app.fileManager, item, folder);
		if (!isFolderExpanded) {
			onToggleExpandState();
		}
		if (itemType === FFS_FILE) {
			await setFocusedFolder(folder);
			await selectFile(item as TFile);
		} else {
			setFocusedFolder(item as TFolder);
		}
	};

	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: [FFS_FILE, FFS_FOLDER],
			drop: async (item: TAbstractFile, monitor) => {
				const itemType = monitor.getItemType();
				await onDrop(item, itemType as string);
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver({ shallow: true }),
			}),
		}),
		[isFolderExpanded]
	);

	drag(drop(folderRef));

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	return (
		<Draggable
			ref={folderRef}
			onClick={() => setFocusedFolder(folder)}
			style={{ opacity: isDragging ? 0 : 1 }}
		>
			<FolderContent
				folder={folder}
				isRoot={isRoot}
				hideExpandIcon={hideExpandIcon}
				isOver={isOver}
				onToggleExpandState={onToggleExpandState}
			/>
		</Draggable>
	);
};

export default Folder;
