import { TFile } from "obsidian";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { FFS_SORT_FOLDER } from "src/assets/constants";
import { StyledManualSortFile } from "./Styled";
import {
	StyledDraggableIcon,
	StyledManualSortItemName,
} from "../Styled/ManualSortModal";

type Props = {
	file: TFile;
};
const FileToSort = ({ file }: Props) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: file.path,
		data: { item: file, type: FFS_SORT_FOLDER },
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<StyledManualSortFile
			ref={setNodeRef}
			id={file.path}
			style={style}
			{...attributes}
			{...listeners}
		>
			<StyledDraggableIcon />
			<StyledManualSortItemName>{file.name}</StyledManualSortItemName>
		</StyledManualSortFile>
	);
};

export default FileToSort;
