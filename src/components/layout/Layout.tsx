import styled, { css } from "styled-components";

const BorderRadiusStyle = css`
	border-radius: var(--ffs-border-radius);
`;
const PaneWithBorderRadiusStyle = css`
	${BorderRadiusStyle}
	background-color: var(--background-secondary);
`;

export const Container = styled.div`
	display: flex;
	height: 100%;
	overflow-y: hidden;
`;

export const BasicPane = styled.div`
	display: flex;
	flex-direction: column;
`;

export const BasicIconWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	svg {
		width: 18px;
		height: 18px;
		stroke: color-mix(in srgb, var(--icon-color), transparent 30%);
	}
`;

export const HorizontalContainer = Container;
export const HorizontalFoldersPane = BasicPane;
export const HorizontalFilesPane = styled(BasicPane)`
	flex: 1;
`;

export const VerticalContainer = styled(Container)`
	flex-direction: column;
`;
export const VerticalFoldersPane = styled(BasicPane)`
	${PaneWithBorderRadiusStyle}
`;
export const VerticalFilesPane = styled(BasicPane)`
	${PaneWithBorderRadiusStyle}
	flex: 1;
	height: 100%;
`;

