import styled from "styled-components";

export const StyledFileContent = styled.div<{
	$isFocused: boolean;
	$isLast: boolean;
	$disableGap?: boolean;
}>`
	display: grid;
	grid-template-rows: auto auto;
	gap: ${({ $disableGap }) => ($disableGap ? undefined : "4px")};
	border-radius: var(--ffs-border-radius);
	padding: 12px 16px 14px;
	background-color: ${({ $isFocused }) =>
		$isFocused ? "var(--interactive-accent)" : undefined} !important;

	&:hover {
		background-color: var(--interactive-hover);
	}

	${({ $isFocused, $isLast }) =>
		!$isFocused &&
		!$isLast &&
		`
    &:not(:hover)::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 14px;
      right: 12px;
      height: var(--border-width);
      background-color: var(--interactive-hover);
    }
  `}
`;