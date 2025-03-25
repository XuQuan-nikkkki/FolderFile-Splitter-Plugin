import styled from "styled-components";
import CreateFolder from "../FolderActions/CreateFolder";
import SortFolders from "../FolderActions/SortFolders";
import ToggleFolders from "../FolderActions/ToggleFolders";
import CreateFile from "../FileActions/CreateFile";
import SortFiles from "../FileActions/SortFiles";

export const Actions = styled.div`
	width: 100%;
	margin-bottom: 8px;
	padding: 8px 16px;
	border-radius: var(--ffs-border-radius);
	background-color: var(--interactive-normal);
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const ActionsSection = styled.div`
	display: flex;
	align-items: center;
	gap: var(--size-4-3);
`;

export const BasicFolderActions = () => (
	<ActionsSection>
		<CreateFolder />
		<SortFolders />
		<ToggleFolders />
	</ActionsSection>
);

export const BasicFileActions = () => (
	<ActionsSection>
		<CreateFile />
		<SortFiles />
	</ActionsSection>
);
