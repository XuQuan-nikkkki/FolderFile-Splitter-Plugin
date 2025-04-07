import styled from "styled-components";

import { FolderIcon } from "src/assets/icons";

export const StyledFolderContent = styled.div.attrs<{
	$isRoot?: boolean;
	$isOver?: boolean;
	$isFocusedOnFolder?: boolean;
	$isFocusedOnFile?: boolean;
}>((props) => {
	const classNames = ["ffs__folder"];

	if (props.$isRoot) classNames.push("ffs__folder--root");
	if (props.$isOver) classNames.push("ffs__folder--over");
	if (props.$isFocusedOnFolder) classNames.push("ffs__folder--active");
	if (props.$isFocusedOnFile)
		classNames.push("ffs__folder--active-with-file");

	return { className: classNames.join(" ") };
})<{
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

export const StyledFolderIcon = styled(FolderIcon).attrs({
	className: "ffs__folder-icon",
})<{
	$isRoot?: boolean;
	$isFocused?: boolean;
}>`
	fill: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "var(--text-muted)"};
	width: ${({ $isRoot }) => ($isRoot ? "16px" : "14px")};
	height: ${({ $isRoot }) => ($isRoot ? "14px" : "12px")};
	margin-right: var(--size-4-2);
`;

export const StyledFolderMainContent = styled.div.attrs({
	className: "ffs__folder-content--main",
})`
	display: flex;
	align-items: center;
	flex: 1;
	overflow: hidden;
`;

