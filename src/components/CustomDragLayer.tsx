import { useDragLayer } from "react-dnd";

const CustomDragLayer = () => {
	const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
		isDragging: monitor.isDragging(),
		item: monitor.getItem(),
		currentOffset: monitor.getSourceClientOffset(),
	}));

	if (!isDragging || !currentOffset) {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				pointerEvents: "none",
				left: currentOffset.x,
				top: currentOffset.y,
				fontSize: "20px",
			}}
		>
			📄
		</div>
	);
};

export default CustomDragLayer;
