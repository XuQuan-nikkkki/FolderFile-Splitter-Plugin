import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useDeduplicateTagFiles = (
	defaultDeduplicate: boolean
): { deduplicateTagFiles: boolean } => {
	const [deduplicateFiles, setDeduplicateFiles] =
		useState(defaultDeduplicate);

	const onChangeDeduplicate = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "deduplicateTagFiles") {
			setDeduplicateFiles(changeValue);
		}
	};

	useWatchSettingsChange(onChangeDeduplicate);

	return { deduplicateTagFiles: deduplicateFiles };
};
