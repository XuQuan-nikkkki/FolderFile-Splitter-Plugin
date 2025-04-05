import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useHideRootFolder = (
	defaultHideRootFolder: boolean
): { hideRootFolder: boolean } => {
	const [hideRootFolder, setHideRootFolder] = useState(defaultHideRootFolder);

	const onChangeHideRootFolder = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "hideRootFolder") {
			setHideRootFolder(changeValue);
		}
	};

	useWatchSettingsChange(onChangeHideRootFolder);

	return { hideRootFolder };
};
