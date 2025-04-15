import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFileCreationDate = (
	defaultShowDate: boolean
): { showFileCreationDate: boolean } => {
	const [showFileCreationDate, setShowFileCreationDate] =
		useState(defaultShowDate);

	const onChangeShowDate = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFileCreationDate") {
			setShowFileCreationDate(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowDate);

	return { showFileCreationDate };
};
