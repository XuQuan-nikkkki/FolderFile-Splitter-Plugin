import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFolderIcon = (
	defaultShowFolderIcon: boolean
): { showFolderIcon: boolean } => {
	const [showFolderIcon, setShowFolderIcon] = useState(defaultShowFolderIcon);

	const onChangeShowFolderIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFolderIcon") {
			setShowFolderIcon(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderIcon);

	return { showFolderIcon };
};
