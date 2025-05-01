import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowTagIcon = (
	defaultShow: boolean
): { showTagIcon: boolean } => {
	const [showIcon, setShowIcon] = useState(defaultShow);

	const onChangeShowIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showTagIcon") {
			setShowIcon(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowIcon);

	return { showTagIcon: showIcon };
};
