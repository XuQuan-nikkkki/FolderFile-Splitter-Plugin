import styled from "styled-components";
import CreateFolder from "../FolderActions/CreateFolder";
import SortFolders from "../FolderActions/SortFolders";
import ToggleFolders from "../FolderActions/ToggleFolders";
import CreateFile from "../FileActions/CreateFile";
import SortFiles from "../FileActions/SortFiles";

export const StyledActionsContainer = styled.div.attrs({
	className: "ffs__actions-container",
})`
	width: 100%;
	margin-bottom: 8px;
	padding: 8px 16px;
	border-radius: var(--ffs-border-radius);
	background-color: var(--interactive-normal);
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const StyledActionsSection = styled.div.attrs({
	className: "ffs__actions-section",
})`
	display: flex;
	align-items: center;
	gap: var(--size-4-3);
`;


export const StyledActionButtonWrapper = styled.div.attrs({
	className: "ffs__action-button-wrapper",
})`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px;

	svg {
		width: 18px;
		height: 18px;
		stroke: var(--icon-color);
	}
	svg:hover {
		transform: scale(1.1);
	}
`;

export const FolderActionSection = () => (
	<StyledActionsSection>
		<CreateFolder />
		<SortFolders />
		<ToggleFolders />
	</StyledActionsSection>
);

export const FileActionSection = () => (
	<StyledActionsSection>
		<CreateFile />
		<SortFiles />
	</StyledActionsSection>
);
