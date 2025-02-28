import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFileDetail = (
	defaultShowFileDetail: boolean
): { showFileDetail: boolean } => {
	const [showFileDetail, setShowFileDetail] = useState(defaultShowFileDetail);

	const onChangeShowFolderIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFileDetail") {
			setShowFileDetail(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderIcon);

	return { showFileDetail };
};
