import styled, { css } from "styled-components";

type Side = "left" | "right";

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

export const ToggleContainer = styled(Container)<{
	$offSide: Side;
}>`
	${BorderRadiusStyle}
	background-color: color-mix(
		in srgb,
		var(--interactive-accent),
		transparent 50%
	);
`;
export const ToggledOnFoldersPane = styled(BasicPane)`
	${PaneWithBorderRadiusStyle}
	flex: 1;
	border-right: 1px solid var(--interactive-hover);
	padding-right: 4px;
`;
export const ToggledOnFilesPane = styled(BasicPane)`
	${PaneWithBorderRadiusStyle}
	flex: 1;
	border-left: 1px solid var(--interactive-hover);
	padding-left: 4px;
`;
export const ToggledOffPaneTitle = styled.div`
	writing-mode: vertical-rl;
	color: color-mix(in srgb, var(--icon-color), transparent 30%);
`;
export const ToggledOffIconWrapper = styled(BasicIconWrapper)`
	flex-direction: column;
	padding-top: 8px;
	width: 30px;
`;
