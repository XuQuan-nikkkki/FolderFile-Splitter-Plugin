import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useAutoHideActionBar = (
	defaultHide: boolean
): { autoHideActionBar: boolean } => {
	const [hide, setHide] = useState(defaultHide);

	const onChangeHide = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "autoHideActionBar") {
			setHide(changeValue);
		}
	};

	useWatchSettingsChange(onChangeHide);

	return { autoHideActionBar: hide };
};
