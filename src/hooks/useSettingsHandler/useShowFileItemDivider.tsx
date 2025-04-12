import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFileItemDivider = (
	defaultShowFileItemDivider: boolean
): { showFileItemDivider: boolean } => {
	const [showFileDivider, setShowFileDivider] = useState(defaultShowFileItemDivider);

	const onChangeShowFolderDivider = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFileItemDivider") {
			setShowFileDivider(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderDivider);

	return { showFileItemDivider: showFileDivider };
};
