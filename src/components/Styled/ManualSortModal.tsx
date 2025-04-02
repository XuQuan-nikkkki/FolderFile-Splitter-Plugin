import styled from "styled-components";

import { GripIcon } from "src/assets/icons";

export const StyledManualSortContainer = styled.div.attrs({
	className: "ffs__manual-sort-container",
})`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

export const StyledManualSortList = styled.div.attrs({
	className: "ffs__manual-sort-list",
})`
	overflow-y: auto;
	height: 50vh;

	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const StyledFolderBreadcrumbs = styled.div.attrs({
	className: "ffs__manual-sort-breadcrumbs",
})`
	width: 100%;
	background-color: var(--interactive-normal);
	border-radius: var(--ffs-border-radius);
	padding: 8px 16px;
`;

export const StyledManualSortItemName = styled.div.attrs({
	className: "ffs__manual-sort-item-name",
})``;

export const StyledSortingItemContainer = styled.div.attrs({
	className: "ffs__sorting-item-container",
})`
	opacity: 0.8;
	transform: scale(1.05);
`;

export const StyledDraggableIcon = styled(GripIcon).attrs({
	className: "ffs__draggable-icon",
})`
	width: 15px;
	height: 15px;
`;
