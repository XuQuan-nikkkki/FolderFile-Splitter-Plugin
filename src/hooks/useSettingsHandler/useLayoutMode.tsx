import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";
import { LayoutMode } from "src/settings";

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
