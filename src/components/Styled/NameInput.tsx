import styled from "styled-components";

export const StyledNameInput = styled.input.attrs({
	className: "ffs__name-input",
})`
	background-color: transparent;
	border: none;
	outline: none;
	color: var(--text-on-accent);
	background-color: var(--text-selection);

	flex: 1;
	overflow: hidden;
	white-space: nowrap;
`;

export const StyledName = styled.div.attrs({
	className: "ffs__name",
})<{
	$isBold?: boolean;
	$isFocused?: boolean;
	$isLarge?: boolean;
}>`
	flex: 1;

	font-size: 13px;
	font-size: ${({ $isLarge }) => ($isLarge ? "14px" : "13px")};
	font-weight: ${({ $isBold }) => ($isBold ? 600 : "normal")};

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	color: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "var(--text-normal)"};
`;
