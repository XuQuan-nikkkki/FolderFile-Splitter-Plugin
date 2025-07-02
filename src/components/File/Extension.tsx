import { TFile } from "obsidian";

export type FileProps = {
	file: TFile;
};
const FileExtension = ({ file }: FileProps) => {
	return (
		<div className="nav-file-tag">
			{file.extension !== "md" && file.extension.toUpperCase()}
		</div>
	);
};

export default FileExtension;
