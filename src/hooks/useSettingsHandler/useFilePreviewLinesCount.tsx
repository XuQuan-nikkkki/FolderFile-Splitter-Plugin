import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useFilePreviewLinesCount = (
	defaultLines: number
): { filePreviewLinesCount: number } => {
	const [linesCount, setLinesCount] = useState<number>(defaultLines);

	const onChangeLinesCount = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "filePreviewLinesCount") {
			setLinesCount(changeValue);
		}
	};

	useWatchSettingsChange(onChangeLinesCount);

	return { filePreviewLinesCount: linesCount };
};
