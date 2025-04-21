import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useBoldFileTitle = (
	defaultBold: boolean
): { boldFileTitle: boolean } => {
	const [bold, setBold] = useState(defaultBold);

	const onChangeBold = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "boldFileTitle") {
			setBold(changeValue);
		}
	};

	useWatchSettingsChange(onChangeBold);

	return { boldFileTitle: bold };
};
