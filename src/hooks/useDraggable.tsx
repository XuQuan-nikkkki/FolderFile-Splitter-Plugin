import { TFile, TFolder } from "obsidian";
import { CSSProperties, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import {
	FFS_DRAG_FILES_TYPE as FFS_DRAG_FILES_TYPE,
	FFS_DRAG_FOLDER_TYPE,
} from "src/assets/constants";

export type DraggableFiles = {
	files: TFile[];
};
export type DraggableFolder = {
	folder: TFolder;
};

export type DraggableItem = DraggableFiles | DraggableFolder;

type Props = {
	type: typeof FFS_DRAG_FILES_TYPE | typeof FFS_DRAG_FOLDER_TYPE;
	item: DraggableItem;
};
const useDraggable = ({ type, item }: Props) => {
	const [{ isDragging }, drag, preview] = useDrag(() => ({
		type,
		item,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
			opacity: monitor.isDragging() ? 0.5 : 1,
		}),
	}));

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	const draggingStyle: CSSProperties = {
		opacity: isDragging ? 0.5 : 1,
	};

	return {
		drag,
		draggingStyle,
	};
};

export default useDraggable;
