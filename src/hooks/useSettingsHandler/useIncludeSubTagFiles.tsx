import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useIncludeSubTagFiles = (
	defaultInclude: boolean
): { includeSubTagFiles: boolean } => {
	const [includeSubTagFiles, setIncludeSubTagFiles] =
		useState(defaultInclude);

	const onChangeIncludeSubTagFiles = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "includeSubTagFiles") {
			setIncludeSubTagFiles(changeValue);
		}
	};

	useWatchSettingsChange(onChangeIncludeSubTagFiles);

	return { includeSubTagFiles };
};
