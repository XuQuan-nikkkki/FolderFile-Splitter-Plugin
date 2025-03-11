import styled from "styled-components";

import { FolderIcon } from "src/assets/icons";

export const StyledFolder = styled.div<{
	$isRoot?: boolean;
	$isOver?: boolean;
	$isFocusedOnFolder?: boolean;
	$isFocusedOnFile?: boolean;
}>`
	height: 30px;
	font-size: ${({ $isRoot }) => ($isRoot ? "14px" : "13px")};
	font-weight: ${({ $isRoot }) => ($isRoot ? 450 : undefined)};
	width: 100%;

	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 6px;
	padding-right: 6px;
	border-radius: var(--ffs-border-radius);

	color: var(--text-muted);
	background-color: ${({ $isFocusedOnFolder, $isFocusedOnFile, $isOver }) => {
		if ($isOver) return "var(--interactive-accent)";
		if ($isFocusedOnFile) return "var(--interactive-hover)";
		if ($isFocusedOnFolder) return "var(--interactive-accent)";
		return undefined;
	}} !important;

	&:hover {
		background-color: var(--interactive-hover);
	}
`;

export const StyledFolderIcon = styled(FolderIcon)<{
	$isRoot?: boolean;
	$isFocused?: boolean;
}>`
	fill: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "#d19600"};
	width: ${({ $isRoot }) => ($isRoot ? "16px" : "14px")};
	height: ${({ $isRoot }) => ($isRoot ? "14px" : "12px")};
	margin-right: var(--size-4-2);
`;

export const FolderLeftSection = styled.div`
	display: flex;
	align-items: center;
	flex: 1;
	overflow: hidden;
`;
