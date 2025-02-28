import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useIncludeSubfolderFilesCount = (
	defaultInclude: boolean
): { includeSubfolderFilesCount: boolean } => {
	const [includeSubfolderFilesCount, setIncludeSubfolderFilesCount] =
		useState(defaultInclude);

	const onChangeShowFolderIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "includeSubfolderFilesCount") {
			setIncludeSubfolderFilesCount(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderIcon);

	return { includeSubfolderFilesCount };
};
