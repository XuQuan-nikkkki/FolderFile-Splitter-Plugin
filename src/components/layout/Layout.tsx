import styled, { css } from "styled-components";

const BorderRadiusStyle = css`
	border-radius: var(--ffs-border-radius);
`;
const PaneWithBorderRadiusStyle = css`
	${BorderRadiusStyle}
	background-color: var(--background-secondary);
`;

export const StyledLayout = styled.div.attrs({
	className: "ffs__layout",
})`
	display: flex;
	height: 100%;
	overflow-y: hidden;
`;

export const StyledLayoutPane = styled.div.attrs({
	className: "ffs__layout-pane",
})`
	display: flex;
	flex-direction: column;
`;

export const StyledHorizontalSplitLayout = styled(StyledLayout).attrs({
	className: "ffs__split-layout--horizontal",
})``;
export const StyledHorizontalFoldersPane = styled(StyledLayoutPane).attrs({
	className: "ffs__folders-pane--horizontal",
})``;
export const StyledHorizontalFilesPane = styled(StyledLayoutPane).attrs({
	className: "ffs__files-pane--horizontal",
})`
	flex: 1;
`;

export const StyledVerticalSplitLayout = styled(StyledLayout).attrs({
	className: "ffs__split-layout--vertical",
})`
	flex-direction: column;
`;
export const StyledVerticalFoldersPane = styled(StyledLayoutPane).attrs({
	className: "ffs__folders-pane--vertical",
})`
	${PaneWithBorderRadiusStyle}
`;
export const StyledVerticalFilesPane = styled(StyledLayoutPane).attrs({
	className: "ffs__files-pane--vertical",
})`
	${PaneWithBorderRadiusStyle}
	flex: 1;
	height: 100%;
`;
