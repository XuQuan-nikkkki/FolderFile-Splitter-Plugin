import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useHighlightActionBar = (
	defaultHightlight: boolean
): { highlightActionBar: boolean } => {
	const [highlight, setHighlight] = useState(defaultHightlight);

	const onChangeHighlight = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "highlightActionBar") {
			setHighlight(changeValue);
		}
	};

	useWatchSettingsChange(onChangeHighlight);

	return { highlightActionBar: highlight };
};
