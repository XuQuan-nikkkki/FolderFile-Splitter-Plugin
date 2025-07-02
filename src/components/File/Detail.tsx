import { TFile } from "obsidian";

import FileCreationDate from "./CreationDate";
import FilePreview from "./Preview";

type Props = {
	file: TFile;
};
const FileDetail = ({ file }: Props) => {
	return (
		<div className="ffs__file-detail">
			<FileCreationDate file={file} />
			<FilePreview file={file} />
		</div>
	);
};

export default FileDetail;
