import { EmptyFolderIcon } from "src/assets/icons";
import styled from "styled-components";

export const StyledEmptyFileTree = styled.div.attrs({
	className: "ffs__file-tree--empty",
})`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const StyledEmptyIcon = styled(EmptyFolderIcon).attrs({
	className: "ffs__empty-file-tree-icon",
})`
	width: 60px;
	height: 60px;
	fill: var(--text-faint);
`;
