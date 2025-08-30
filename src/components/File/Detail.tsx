import { TFile } from "obsidian";

import { useExplorer } from "src/hooks/useExplorer";
import usePreviewFile from "src/hooks/usePreviewFile";
import { useFilePreviewLinesCount } from "src/hooks/useSettingsHandler";

import FileCreationDate from "./CreationDate";

type Props = {
	file: TFile;
};
const FileDetail = ({ file }: Props) => {
	const { preview, isLoading } = usePreviewFile(file);
	const { plugin } = useExplorer();
	const { settings } = plugin;

	const { filePreviewLinesCount } = useFilePreviewLinesCount(
		settings.filePreviewLinesCount
	);

	const getPreviewString = () => {
		if (filePreviewLinesCount === 0) return "";
		if (isLoading) return "...";
		return preview;
	};

	return (
		<div
			className="ffs__file-detail"
			style={{
				WebkitLineClamp: String(filePreviewLinesCount) as any,
				lineClamp: filePreviewLinesCount as any,
			}}
		>
			<FileCreationDate file={file} />
			{getPreviewString()}
		</div>
	);
};

export default FileDetail;
