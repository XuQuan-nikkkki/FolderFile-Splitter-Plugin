import { CSSProperties, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

type Props = {
	type: string;
	item: unknown;
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
