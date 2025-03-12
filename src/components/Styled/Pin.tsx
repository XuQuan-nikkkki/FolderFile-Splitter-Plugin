import styled from "styled-components";

export const PinnedSection = styled.div`
	margin-bottom: 16px;
	padding: 6px 4px 2px;
	border-bottom: var(--border-width) solid var(--background-modifier-border);

	.ffs-pin-icon {
		width: 12px;
		height: 12px;
		margin-right: 2px;
		fill: var(--icon-color);
		color: var(--icon-color);
	}
`;

export const PinnedTitle = styled.div`
	display: flex;
	align-items: center;
	font-weight: 500;
	color: var(--icon-color);
	margin-bottom: 4px;
	margin-left: 2px;
	font-size: 12px;
`;

export const PinnedContent = styled.div<{ $indent?: boolean }>`
	margin-left: ${({ $indent }) => ($indent ? "4px" : undefined)};
`;
