import { TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";
import { useEffect, useRef } from "react";

import { FILE_MANUAL_SORT_RULE, FileTreeStore } from "src/store";
import FileContent, { FileProps } from "./FileContent";
import { FFS_FILE } from "src/assets/constants";
import { Draggable, StyledDraggableIcon } from "./Styled/Sortable";
import { getEmptyImage } from "react-dnd-html5-backend";

const File = ({
	file,
	fileList,
	useFileTreeStore,
	plugin,
	deleteFile,
}: FileProps) => {
	const {
		fileSortRule,
		order,
		changeFilesManualOrder,
		changeFilesManualOrderAndSave,
		selectFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			order: store.filesManualSortOrder,
			fileSortRule: store.fileSortRule,
			changeFilesManualOrder: store.changeFilesManualOrder,
			changeFilesManualOrderAndSave: store.changeFilesManualOrderAndSave,
			selectFile: store.selectFile,
		}))
	);

	const fileRef = useRef<HTMLDivElement>(null);
	const paths = file.parent ? order[file.parent.path] : [];

	const [{ isDragging }, drag, preview] = useDrag(
		() => ({
			type: FFS_FILE,
			item: file,
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
		}),
		[changeFilesManualOrderAndSave, order]
	);

	const [, drop] = useDrop(
		() => ({
			accept: FFS_FILE,
			hover: (item: TFile) => {
				if (fileSortRule !== FILE_MANUAL_SORT_RULE) return;
				if (item.path !== file.path) {
					const atIndex = paths.indexOf(file.path);
					changeFilesManualOrder(item, atIndex);
				}
			},
			drop: (item) => {
				const atIndex = paths.indexOf(file.path);
				changeFilesManualOrderAndSave(item, atIndex);
			},
		}),
		[changeFilesManualOrder, order, fileSortRule]
	);

	drag(drop(fileRef));

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	return (
		<Draggable
			ref={fileRef}
			style={{ opacity: isDragging ? 0 : 1 }}
			onClick={() => selectFile(file)}
		>
			<FileContent
				useFileTreeStore={useFileTreeStore}
				file={file}
				plugin={plugin}
				deleteFile={deleteFile}
				fileList={fileList}
			/>
			{fileSortRule === FILE_MANUAL_SORT_RULE && (
				<StyledDraggableIcon $top="12px" $left="2px" />
			)}
		</Draggable>
	);
};

export default File;
