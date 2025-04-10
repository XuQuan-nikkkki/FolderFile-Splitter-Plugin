import CreateFolder from "../FolderActions/CreateFolder";
import SortFolders from "../FolderActions/SortFolders";
import ToggleFolders from "../FolderActions/ToggleFolders";
import CreateFile from "../FileActions/CreateFile";
import SortFiles from "../FileActions/SortFiles";

export const FolderActionSection = () => (
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
