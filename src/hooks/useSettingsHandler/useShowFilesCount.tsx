import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFilesCount = (
	defaultShow: boolean
): { showFilesCount: boolean } => {
	const [showFilesCount, setShowFilesCount] = useState(defaultShow);

	const onChangeShow = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFilesCount") {
			setShowFilesCount(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShow);

	return { showFilesCount };
};
