import { useState } from "react";

import { ExpandNodeOnClick } from "src/settings";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useExpandNodeByClick = (
	defaultExpandNodeByClick: ExpandNodeOnClick
): { expandNodeByClick: ExpandNodeOnClick } => {
	const [expandNodeByClick, setExpandNodeByClick] =
		useState<ExpandNodeOnClick>(defaultExpandNodeByClick);

	const onChangeExpand = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "expandNodeByClick") {
			setExpandNodeByClick(changeValue);
		}
	};

	useWatchSettingsChange(onChangeExpand);

	return { expandNodeByClick };
};
