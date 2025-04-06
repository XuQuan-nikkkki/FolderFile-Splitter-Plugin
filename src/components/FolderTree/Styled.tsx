import styled from "styled-components";

export const StyledFolderTreeItem = styled.div.attrs({
	className: "ffs__folder-tree-item",
})``;

export const StyledSubfoldersGroup = styled.div.attrs({
	className: "ffs__subfolders-group",
})<{ $showHierarchyLine?: boolean }>`
	position: relative;
	margin-left: 12px;
	padding-left: 2px;
	border-left: ${({ $showHierarchyLine }) =>
		$showHierarchyLine
			? "var(--border-width) solid var(--interactive-hover)"
			: undefined};
`;
