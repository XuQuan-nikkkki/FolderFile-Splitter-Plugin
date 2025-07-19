import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowViewModeDisplay = (
	defaultShow: boolean
): { showViewModeDisplay: boolean } => {
	const [showViewModeDisplay, setShowViewModeDisplay] = useState(defaultShow);

	const onChangeShow = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showViewModeDisplay") {
			setShowViewModeDisplay(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShow);

	return { showViewModeDisplay };
};
