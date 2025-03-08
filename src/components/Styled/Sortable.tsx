import styled from "styled-components";
import StyledDragIcon from "./DragIcon";

export const StyledSortableIcon = styled(StyledDragIcon)<{
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

export const Sortable = styled.div`
	position: relative;

	&:hover ${StyledSortableIcon} {
		visibility: visible;
		opacity: 0.4;
	}
`;
