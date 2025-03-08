import { TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

import { FILE_MANUAL_SORT_RULE, FileTreeStore } from "src/store";
import File, { FileProps } from "./File";
import { FFS_SORT_FILE_TYPE } from "src/assets/constants";
import { Sortable, StyledSortableIcon } from "./Styled/Sortable";

const SortableFile = ({
	file,
	fileList,
	useFileTreeStore,
	plugin,
	deleteFile,
	isSelected,
}: FileProps) => {
	const {
		fileSortRule,
		order,
		changeFilesManualOrder,
		changeFilesManualOrderAndSave,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			order: store.filesManualSortOrder,
			fileSortRule: store.fileSortRule,
			changeFilesManualOrder: store.changeFilesManualOrder,
			changeFilesManualOrderAndSave: store.changeFilesManualOrderAndSave,
		}))
	);

	const fileRef = useRef<HTMLDivElement>(null);
	const paths = file.parent ? order[file.parent.path] : [];

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: FFS_SORT_FILE_TYPE,
			item: file,
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[changeFilesManualOrderAndSave, order]
	);

	const [, drop] = useDrop(
		() => ({
			accept: FFS_SORT_FILE_TYPE,
			hover: (item: TFile) => {
				if (item.path !== file.path) {
					const atIndex = paths.indexOf(file.path);
					changeFilesManualOrder(item, atIndex);
				}
			},
			drop: (item, monitor) => {
				const atIndex = paths.indexOf(file.path);
				changeFilesManualOrderAndSave(item, atIndex);
			},
		}),
		[changeFilesManualOrder, order]
	);

	drag(drop(fileRef));

	return (
		<Sortable
			ref={fileRef}
			style={{
				opacity: isDragging ? 0 : 1,
				backgroundColor: isDragging ? "none" : undefined,
			}}
		>
			<File
				useFileTreeStore={useFileTreeStore}
				file={file}
				plugin={plugin}
				deleteFile={deleteFile}
				fileList={fileList}
				isSelected={isSelected}
			/>
			{fileSortRule === FILE_MANUAL_SORT_RULE && (
				<StyledSortableIcon $top="12px" $left="4px" />
			)}
		</Sortable>
	);
};

export default SortableFile;
