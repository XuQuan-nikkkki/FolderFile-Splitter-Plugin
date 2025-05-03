import CreateFolder from "../FolderAndTagActions/CreateFolder";
import SortFolders from "../FolderAndTagActions/SortFoldersAndTags";
import ToggleFolders from "../FolderAndTagActions/ToggleFolders";
import CreateFile from "../FileActions/CreateFile";
import SortFiles from "../FileActions/SortFiles";

export const FolderAndTagActionSection = () => (
	<div className="ffs__actions-section nav-buttons-container">
		<CreateFolder />
		<SortFolders />
		<ToggleFolders />
	</div>
);

export const FileActionSection = () => (
	<div className="ffs__actions-section nav-buttons-container">
		<CreateFile />
		<SortFiles />
	</div>
);
