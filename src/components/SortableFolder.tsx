import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

import { FileTreeStore, FOLDER_MANUAL_SORT_RULE } from "src/store";
import { FFS_SORT_FILE_TYPE, FFS_SORT_FOLDER_TYPE } from "src/assets/constants";
import Folder, { FolderProps } from "./Folder";
import { Sortable, StyledSortableIcon } from "./Styled/Sortable";

const SortableFolder = ({
	folder,
	useFileTreeStore,
	plugin,
	onToggleExpandState,
	isRoot = false,
	hideExpandIcon = false,
	isSelected = false,
}: FolderProps) => {
	const {
		folderSortRule,
		order,
		changeFoldersManualOrder,
		changeFoldersManualOrderAndSave,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			order: store.foldersManualSortOrder,
			folderSortRule: store.folderSortRule,
			changeFoldersManualOrder: store.changeFoldersManualOrder,
			changeFoldersManualOrderAndSave:
				store.changeFoldersManualOrderAndSave,
		}))
	);

	const folderRef = useRef<HTMLDivElement>(null);
	const paths = folder.parent ? order[folder.parent.path] : [];

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: FFS_SORT_FOLDER_TYPE,
			item: folder,
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[changeFoldersManualOrderAndSave, order]
	);

	const [, drop] = useDrop(
		() => ({
			accept: FFS_SORT_FILE_TYPE,
			hover: (item: TFolder) => {
				if (item.path !== folder.path) {
					const atIndex = paths.indexOf(folder.path);
					changeFoldersManualOrder(item, atIndex);
				}
			},
			drop: (item, monitor) => {
				const atIndex = paths.indexOf(folder.path);
				changeFoldersManualOrderAndSave(item, atIndex);
			},
		}),
		[changeFoldersManualOrder, order]
	);

	drag(drop(folderRef));

	return (
		<Sortable
			ref={folderRef}
			style={{
				opacity: isDragging ? 0 : 1,
				backgroundColor: isDragging ? "none" : undefined,
			}}
		>
			<Folder
				folder={folder}
				plugin={plugin}
				useFileTreeStore={useFileTreeStore}
				onToggleExpandState={onToggleExpandState}
				isRoot={isRoot}
				hideExpandIcon={hideExpandIcon}
				isSelected={isSelected}
			/>
			{folderSortRule === FOLDER_MANUAL_SORT_RULE && (
				<StyledSortableIcon $top="7px" $right="16px" />
			)}
		</Sortable>
	);
};

export default SortableFolder;
