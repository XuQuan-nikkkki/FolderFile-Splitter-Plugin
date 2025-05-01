import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useIncludeSubfolderFiles = (
	defaultInclude: boolean
): { includeSubfolderFiles: boolean } => {
	const [includeSubfolderFiles, setIncludeSubfolderFiles] =
		useState(defaultInclude);

	const onChangeIncludeSubfolderFiles = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "includeSubfolderFiles") {
			setIncludeSubfolderFiles(changeValue);
		}
	};

	useWatchSettingsChange(onChangeIncludeSubfolderFiles);

	return { includeSubfolderFiles };
};
