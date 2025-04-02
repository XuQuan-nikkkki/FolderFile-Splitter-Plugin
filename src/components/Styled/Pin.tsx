import styled from "styled-components";

export const StyledPinnedContainer = styled.div.attrs({
	className: "ffs__pin-container",
})`
	margin-bottom: 16px;
	padding-bottom: 16px;
	border-bottom: var(--border-width) solid var(--background-modifier-border);

	.ffs-pin-icon {
		width: 12px;
		height: 12px;
		margin-right: 2px;
		fill: var(--icon-color);
		color: var(--icon-color);
	}
`;

export const StyledPinnedHeader = styled.div.attrs({
	className: "ffs__pin-header",
})`
	display: flex;
	align-items: center;
	font-weight: 500;
	color: var(--icon-color);
	margin-bottom: 4px;
	margin-left: 2px;
	font-size: 12px;
`;

export const StyledPinnedContent = styled.div.attrs({
	className: "ffs__pin-content",
})<{ $indent?: boolean }>`
	margin-left: ${({ $indent }) => ($indent ? "4px" : undefined)};
`;

export const StyledPinTitle = styled.span.attrs({
	className: "ffs__pin-title",
})``