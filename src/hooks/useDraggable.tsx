import { TFile, TFolder } from "obsidian";
import { CSSProperties, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { FFS_DRAG_FILE_TYPE, FFS_DRAG_FOLDER_TYPE } from "src/assets/constants";

export type DraggableFile = {
	file: TFile;
};
export type DraggableFolder = {
	folder: TFolder;
};

export const isDraggableFile = (item: DraggableItem): item is DraggableFile =>
	(item as DraggableFile).file !== undefined;

export const isDraggableFolder = (
	item: DraggableItem
): item is DraggableFolder => (item as DraggableFolder).folder !== undefined;

export type DraggableItem = DraggableFile | DraggableFolder;

type Props = {
	type: typeof FFS_DRAG_FILE_TYPE | typeof FFS_DRAG_FOLDER_TYPE;
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
