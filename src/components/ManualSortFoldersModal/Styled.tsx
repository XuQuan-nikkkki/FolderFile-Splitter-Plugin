import styled from "styled-components";

export const StyledManualSortFolder = styled.div.attrs({
	className: "ffs__manual-sort-item--folder",
})`
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 8px;
	height: 30px;
	align-items: center;
	padding: 4px;
	border-radius: var(--ffs-border-radius);
	touch-action: none;

	&:hover {
		background-color: var(--interactive-hover);
	}
`;

export const StyledDraggableArea = styled.div.attrs({
	className: "ffs__draggable-area",
})`
	display: flex;
	gap: 8px;
	align-items: center;
`;

export const StyledEnterFolderButton = styled.span.attrs({
	className: "ffs__enter-folder-button",
})<{ $disabled?: boolean }>`
	color: ${({ $disabled }) =>
		$disabled
			? "color-mix(in srgb, var(--text-accent), transparent 50%)"
			: "var(--text-accent)"};
	text-decoration: underline;
	cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : undefined)};
`;
