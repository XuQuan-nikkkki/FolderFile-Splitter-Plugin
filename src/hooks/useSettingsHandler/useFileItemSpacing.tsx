import { useState } from "react";

import { FileItemSpacing } from "src/settings";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useFileItemSpacing = (
	defaultSpacing: FileItemSpacing
): { fileItemSpacing: FileItemSpacing } => {
	const [spacing, setSpacing] = useState<FileItemSpacing>(defaultSpacing);

	const onChangeSpacing = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "fileItemSpacing") {
			setSpacing(changeValue);
		}
	};

	useWatchSettingsChange(onChangeSpacing);

	return { fileItemSpacing: spacing };
};
