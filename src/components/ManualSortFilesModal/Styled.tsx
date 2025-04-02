import styled from "styled-components";

export const StyledManualSortFile = styled.div.attrs({
	className: "ffs__manual-sort-item--file",
})`
	display: grid;
	grid-template-columns: 20px 1fr;
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
