import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFolderView = (
	defaultShow: boolean
): { showFolderView: boolean } => {
	const [showFolderView, setShowFolderView] = useState(defaultShow);

	const onChangeShowFolderView = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFolderView") {
			setShowFolderView(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderView);

	return { showFolderView };
};
