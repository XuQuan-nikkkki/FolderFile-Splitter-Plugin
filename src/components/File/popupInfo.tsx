import dayjs from "dayjs";
import { TFile } from "obsidian";

import { isZh } from "src/utils";

const DATE_FORMAT = "YYYY-MM-DD HH:mm";

const formatTime = (timestamp: number) => dayjs(timestamp).format(DATE_FORMAT);

export const getPopupInfo = (file: TFile): string => {
	const { basename, stat } = file;
	const { ctime, mtime } = stat;

	const modifiedInfo = formatTime(mtime);
	const createdInfo = formatTime(ctime);

	if (isZh) {
		return `${basename}\n最后修改于 ${modifiedInfo}\n创建于 ${createdInfo}`;
	}
	return `${basename}\nLast modified at ${modifiedInfo}\nCreated at ${createdInfo}`;
};
