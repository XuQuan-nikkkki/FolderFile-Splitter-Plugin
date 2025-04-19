import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useFileCreationDateFormat = (
	defaultFormat: string
): { fileCreationDateFormat: string } => {
	const [format, setFormat] = useState<string>(defaultFormat);

	const onChangeFormat = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "fileCreationDateFormat") {
			setFormat(changeValue);
		}
	};

	useWatchSettingsChange(onChangeFormat);

	return { fileCreationDateFormat: format };
};
