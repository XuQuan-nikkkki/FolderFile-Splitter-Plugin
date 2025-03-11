import styled from "styled-components";
import StyledDragIcon from "./DragIcon";

export const StyledDraggableIcon = styled(StyledDragIcon)<{
	$top?: string;
	$left?: string;
	$right?: string;
	$bottom?: string;
}>`
	top: ${({ $top }) => $top};
	left: ${({ $left }) => $left};
	right: ${({ $right }) => $right};
	bottom: ${({ $bottom }) => $bottom};
`;

export const Draggable = styled.div`
	position: relative;

	&:hover ${StyledDraggableIcon} {
		visibility: visible;
		opacity: 0.4;
	}
`;
