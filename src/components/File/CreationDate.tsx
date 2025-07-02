import dayjs from "dayjs";
import { TFile } from "obsidian";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useFileCreationDateFormat,
	useShowFileCreationDate,
} from "src/hooks/useSettingsHandler";

type Props = {
	file: TFile;
};
const FileCreationDate = ({ file }: Props) => {
	const { plugin } = useExplorer();
	const { settings } = plugin;

	const {
		showFileCreationDate: showDate,
		fileCreationDateFormat: dateFormat,
	} = settings;
	const { showFileCreationDate } = useShowFileCreationDate(showDate);
	const { fileCreationDateFormat } = useFileCreationDateFormat(dateFormat);

	if (!showFileCreationDate) return null;
	return (
		<div className="ffs__file-created-time">
			{dayjs(file.stat.ctime).format(fileCreationDateFormat)}
		</div>
	);
};

export default FileCreationDate;
