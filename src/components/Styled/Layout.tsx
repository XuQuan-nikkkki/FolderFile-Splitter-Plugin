import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	height: 100%;
	overflow-y: hidden;
`;

export const FoldersPane = styled.div`
	display: flex;
	flex-direction: column;
`;

export const FilesPane = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
`;

export const HorizontalContainer = Container;

export const VerticalContainer = styled(Container)`
	flex-direction: column;
`;

export const ToggleContainer = styled(Container)<{
	$offSide: "left" | "right";
}>`
	display: grid;
	grid-template-columns: ${({ $offSide }) =>
		$offSide === "left" ? "30px 1fr" : "1fr 30px"};
	border-radius: var(--ffs-border-radius);
	background-color: color-mix(
		in srgb,
		var(--interactive-accent),
		transparent 50%
	);
`;

export const ToggleFoldersPane = styled(FoldersPane);

export const ToggledOnFoldersPane = styled(FoldersPane)`
	flex: 1;
	border-right: 1px solid var(--interactive-hover);
	padding-right: 4px;
	background-color: var(--background-secondary);
	border-radius: var(--ffs-border-radius);
`;

export const ToggledOnFilesPane = styled(FilesPane)`
	flex: 1;
	border-left: 1px solid var(--interactive-hover);
	background-color: var(--background-secondary);
	border-radius: var(--ffs-border-radius);
	padding-left: 4px;
`;

export const VerticalWord = styled.div`
	writing-mode: vertical-rl;
	color: color-mix(in srgb, var(--icon-color), transparent 30%);
`;

export const IconWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding-top: 8px;

	svg {
		width: 18px;
		height: 18px;
		stroke: color-mix(in srgb, var(--icon-color), transparent 30%);
	}
`;
