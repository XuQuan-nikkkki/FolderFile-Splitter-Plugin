import styled from "styled-components";

export const FOLDERS_PANE_MIN_WIDTH = 140;
export const FILES_PANE_MIN_WIDTH = 200;

export const Container = styled.div`
	display: flex;
	height: 100%;
	overflow-y: hidden;
`;

const FoldersPane = styled.div`
	display: flex;
	flex-direction: column;
`;

const FilesPane = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
`;

export const HorizontalSplitContainer = Container;
export const HorizontalSplitFoldersPane = styled(FoldersPane)`
	min-width: ${FOLDERS_PANE_MIN_WIDTH}px;
`;
export const HorizontalSplitFilesPane = styled(FilesPane)`
	min-width: ${FILES_PANE_MIN_WIDTH}px;
`;
