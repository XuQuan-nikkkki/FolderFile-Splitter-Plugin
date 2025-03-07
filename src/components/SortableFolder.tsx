import { TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

import { FileTreeStore, FOLDER_MANUAL_SORT_RULE } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import { GripIcon } from "src/assets/icons";
import { FFS_SORT_FILE_TYPE, FFS_SORT_FOLDER_TYPE } from "src/assets/constants";
import Folder from "./Folder";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	folder: TFolder;
	plugin: FolderFileSplitterPlugin;
	onToggleExpandState: () => void;
	isRoot?: boolean;
};
const SortableFolder = ({
	folder,
	useFileTreeStore,
	plugin,
	onToggleExpandState,
	isRoot = false,
}: Props) => {
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
		<div
			ref={folderRef}
			className="ffs-sortable-folder"
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
			/>
			{folderSortRule === FOLDER_MANUAL_SORT_RULE && (
				<div className="ffs-drag-sort-icon">
					<GripIcon />
				</div>
			)}
		</div>
	);
};

export default SortableFolder;
