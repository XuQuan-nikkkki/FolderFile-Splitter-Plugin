import { TFile } from "obsidian";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { StyledIcon } from "../Styled/DragIcon";
import { FFS_SORT_FOLDER } from "src/assets/constants";

const StyledFile = styled.div`
	display: grid;
	grid-template-columns: 20px 1fr;
	gap: 8px;
	height: 30px;
	align-items: center;
	padding: 4px;
	border-radius: var(--ffs-border-radius);
	touch-action: none;

	&:hover {
		background-color: var(--interactive-hover);
	}
`;

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
		<StyledFile
			ref={setNodeRef}
			id={file.path}
			style={style}
			{...attributes}
			{...listeners}
		>
			<StyledIcon />
			<div>{file.name}</div>
		</StyledFile>
	);
};

export default FileToSort;
