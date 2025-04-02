import { useRef } from "react";
import styled from "styled-components";

export type Direction = "horizontal" | "vertical";

const StyledLayoutDivider = styled.div.attrs({
	className: "ffs__layout-divider",
})`
	border: 1px solid var(--divider-color);
`;
const StyledHorizontalSplitDivider = styled(StyledLayoutDivider).attrs({
	className: "ffs__layout-divider--horizontal",
})`
	cursor: ew-resize;
	margin: 0 8px;
`;
const StyledVerticalSplitDivider = styled(StyledLayoutDivider).attrs({
	className: "ffs__layout-divider--vertical",
})`
	cursor: ns-resize;
	margin: 16px 0;
`;

type HorizontalProps = {
	initialWidth: number | undefined;
	onChangeWidth: (width: number) => void;
};
export const HorizontalDraggableDivider = ({
	initialWidth,
	onChangeWidth,
}: HorizontalProps) => {
	const dividerRef = useRef<HTMLDivElement | null>(null);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const startX = e.clientX;
		const startWidth = initialWidth ?? 0;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const newWidth = startWidth + (moveEvent.clientX - startX);
			onChangeWidth(newWidth);
		};

		const handleMouseUp = () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<StyledHorizontalSplitDivider
			ref={dividerRef}
			onMouseDown={handleMouseDown}
		/>
	);
};

type VerticalProps = {
	initialHeight: number | undefined;
	onChangeHeight: (height: number) => void;
};
export const VerticalDraggableDivider = ({
	initialHeight,
	onChangeHeight,
}: VerticalProps) => {
	const dividerRef = useRef<HTMLDivElement | null>(null);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const startY = e.clientY;
		const startHeight = initialHeight ?? 0;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const newHeight = startHeight + (moveEvent.clientY - startY);
			onChangeHeight(newHeight);
		};

		const handleMouseUp = () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<StyledVerticalSplitDivider
			ref={dividerRef}
			onMouseDown={handleMouseDown}
		/>
	);
};
