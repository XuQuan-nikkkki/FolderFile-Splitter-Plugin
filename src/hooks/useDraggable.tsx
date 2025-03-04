import { TFile, TFolder } from "obsidian";
import { CSSProperties, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import {
	FFS_DRAG_FILES_TYPE,
	FFS_DRAG_FOLDERS_TYPE,
} from "src/assets/constants";

export const getDraggingStyles = (isDragging: boolean): CSSProperties => {
	return { opacity: isDragging ? 0.5 : 1 };
};

export type DraggableFiles = {
	files: TFile[];
};
export type DraggableFolders = {
	folders: TFolder[];
};

export type DraggableItem = DraggableFiles | DraggableFolders;

type Props = {
	type: typeof FFS_DRAG_FILES_TYPE | typeof FFS_DRAG_FOLDERS_TYPE;
	item: DraggableItem | (() => DraggableItem);
	end?: () => void;
	deps?: unknown[];
};
const useDraggable = ({ type, item, end, deps }: Props) => {
	const [{ isDragging }, drag, preview] = useDrag(
		() => ({
			type,
			item,
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
			end,
		}),
		[deps]
	);

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	const draggingStyle: CSSProperties = {
		opacity: isDragging ? 0.5 : 1,
	};

	return {
		drag,
		draggingStyle,
		isDragging,
	};
};

export default useDraggable;
