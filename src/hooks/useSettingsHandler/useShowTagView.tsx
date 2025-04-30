import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowTagView = (
	defaultShow: boolean
): { showTagView: boolean } => {
	const [showTagView, setShowTagView] = useState(defaultShow);

	const onChangeShowTag = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showTagView") {
			setShowTagView(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowTag);

	return { showTagView };
};
