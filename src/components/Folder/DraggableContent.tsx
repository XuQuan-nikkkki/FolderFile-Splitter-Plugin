import { useDraggable } from "@dnd-kit/core";
import classNames from "classnames";

import {
	FFS_DRAG_FOLDER,
	TREE_ITEM_INNER_CLASS_NAME,
} from "src/assets/constants";

import FolderContent, { FolderProps } from "./Content";

type Props = FolderProps & {
	disableDrag?: boolean;
};
const FolderDraggableContent = ({ folder, disableDrag = false }: Props) => {
	const {
		setNodeRef: setDragRef,
		attributes,
		listeners,
		isDragging,
	} = useDraggable({
		id: folder.path,
		data: { type: FFS_DRAG_FOLDER, item: folder },
		disabled: disableDrag,
	});

	return (
		<div
			className={classNames(
				"ffs__draggable-container",
				TREE_ITEM_INNER_CLASS_NAME
			)}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			ref={setDragRef}
			{...attributes}
			{...listeners}
		>
			<FolderContent folder={folder} />
		</div>
	);
};

export default FolderDraggableContent;
