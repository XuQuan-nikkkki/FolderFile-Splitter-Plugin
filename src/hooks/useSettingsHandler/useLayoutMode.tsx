import { useState } from "react";

import { LayoutMode } from "src/settings";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useLayoutMode = (
	defaultLayout: LayoutMode
): { layoutMode: LayoutMode } => {
	const [layoutMode, setLayoutMode] = useState<LayoutMode>(defaultLayout);

	const onChangeLayoutMode = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "layoutMode") {
			setLayoutMode(changeValue);
		}
	};

	useWatchSettingsChange(onChangeLayoutMode);

	return { layoutMode };
};
