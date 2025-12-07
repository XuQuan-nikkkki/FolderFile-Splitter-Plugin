import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useAutoScrollToCenter = (
	defaultAutoScroll: boolean
): { autoScrollToCenter: boolean } => {
	const [autoScroll, setAutoScroll] = useState(defaultAutoScroll);

	const onChangeAutoScroll = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "autoScrollToCenter") {
			setAutoScroll(changeValue);
		}
	};

	useWatchSettingsChange(onChangeAutoScroll);

	return { autoScrollToCenter: autoScroll };
};
