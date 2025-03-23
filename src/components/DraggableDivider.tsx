import { useRef } from "react";
import styled from "styled-components";

export type Direction = "horizontal" | "vertical";
const PaneDivider = styled.div<{ $direction: Direction }>`
	border: 1px solid var(--divider-color);
	cursor: ${({ $direction }) =>
		$direction === "horizontal" ? "ew-resize" : "ns-resize"};
	margin: ${({ $direction }) =>
		$direction === "horizontal" ? "0 8px" : "16px 0"};
`;

type Props = {
	direction: Direction;
	initialWidth: number | undefined;
	initialHeight: number | undefined;
	onChangeWidth: (width: number) => void;
	onChangeHeight: (height: number) => void;
};
const DraggableDivider = ({
	direction,
	initialWidth,
	initialHeight,
	onChangeWidth,
	onChangeHeight,
}: Props) => {
	const dividerRef = useRef<HTMLDivElement | null>(null);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = initialWidth ?? 0;
		const startHeight = initialHeight ?? 0;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			if (direction === "horizontal") {
				const newWidth = startWidth + (moveEvent.clientX - startX);
				onChangeWidth(newWidth);
			} else {
				const newHeight = startHeight + (moveEvent.clientY - startY);
				onChangeHeight(newHeight);
			}
		};

		const handleMouseUp = () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<PaneDivider
			ref={dividerRef}
			onMouseDown={handleMouseDown}
			$direction={direction}
		/>
	);
};

export default DraggableDivider;
