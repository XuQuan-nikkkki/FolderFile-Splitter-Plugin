import { useDraggable } from "@dnd-kit/core";

import { FFS_DRAG_FOLDER } from "src/assets/constants";

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
			className="ffs__draggable-container tree-item-inner nav-folder-title-content"
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
