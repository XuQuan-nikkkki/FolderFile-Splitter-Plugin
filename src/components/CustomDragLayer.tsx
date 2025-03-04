import { useDragLayer } from "react-dnd";
import {
	FFS_DRAG_FILES_TYPE,
	FFS_DRAG_FOLDER_TYPE,
} from "src/assets/constants";

const CustomDragLayer = () => {
	const { isDragging, currentOffset, itemType } = useDragLayer((monitor) => ({
		isDragging: monitor.isDragging(),
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		currentOffset: monitor.getClientOffset(),
	}));

	if (!isDragging || !currentOffset) {
		return null;
	}

	const renderDraggingIcon = () => {
		if (itemType === FFS_DRAG_FOLDER_TYPE) {
			return "📁";
		} else if (itemType === FFS_DRAG_FILES_TYPE) {
			return "📄";
		}
	};

	return (
		<div
			style={{
				position: "fixed",
				pointerEvents: "none",
				left: currentOffset.x,
				top: currentOffset.y,
				transform: "translate(-40px, -70px)",
				fontSize: 20,
				zIndex: 100,
			}}
		>
			{renderDraggingIcon()}
		</div>
	);
};

export default CustomDragLayer;
