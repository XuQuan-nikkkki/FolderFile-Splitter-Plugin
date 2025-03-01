import { TFile } from "obsidian";
import { useDragLayer } from "react-dnd";

const CustomDragLayer = () => {
	const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
		isDragging: monitor.isDragging(),
		item: monitor.getItem(),
		currentOffset: monitor.getClientOffset(),
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
				transform: "translate(-40px, -70px)",
				fontSize: "20px",
			}}
		>
			{item instanceof TFile ? "📄" : "📁"}
		</div>
	);
};

export default CustomDragLayer;
