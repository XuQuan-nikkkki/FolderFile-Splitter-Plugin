import { TFile } from "obsidian";

import usePreviewFile from "src/hooks/usePreviewFile";

import FileCreationDate from "./CreationDate";

type Props = {
	file: TFile;
};
const FileDetail = ({ file }: Props) => {
	const { preview, isLoading } = usePreviewFile(file);

	
	return (
		<div className="ffs__file-detail">
			<FileCreationDate file={file} />
			<div className="ffs__file-content-preview">
				{isLoading ? "..." : preview}
			</div>
		</div>
	);
};

export default FileDetail;
