import styled from "styled-components";

export const StyledFileTreeItem = styled.div.attrs({
	className: "ffs__file-tree-item",
})<{ $isDragging: boolean }>`
	opacity: ${({ $isDragging }) => ($isDragging ? 0 : 1)};
`;

export const StyledFileContent = styled.div.attrs({
	className: "ffs__file-content",
})<{
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

export const StyledFileContentHeader = styled.div.attrs({
	className: "ffs__file-content-header",
})`
	display: flex;
	overflow: hidden;
	align-items: center;
`;

export const StyledFileExtension = styled.span.attrs({
	className: "ffs__file-extension",
})<{ $isFocused: boolean }>`
	color: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "var(--text-faint)"};
	font-size: 9px;
	font-weight: var(--font-semibold);
`;

export const StyledFileDetail = styled.div.attrs({
	className: "ffs__file-detail",
})`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 10px;
	font-size: 12px;
`;

export const StyledFileCreatedTime = styled.div.attrs({
	className: "ffs__file-created-time",
})<{ $isFocused: boolean }>`
	letter-spacing: -0.6px;
	font-weight: 450;
	color: ${({ $isFocused: isFocused }) =>
		isFocused ? "var(--text-on-accent)" : " var(--text-normal)"};
`;

export const StyledFileContentPreview = styled.span.attrs({
	className: "ffs__file-content-preview",
})<{ $isFocused: boolean }>`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: ${({ $isFocused: isFocused }) =>
		isFocused ? "var(--text-on-accent)" : " var(--text-muted)"};
`;
