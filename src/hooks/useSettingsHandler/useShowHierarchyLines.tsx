import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowHierarchyLines = (
	defaultShowHierarchyLines: boolean
): { showHierarchyLines: boolean } => {
	const [showHierarchyLines, setShowHierarchyLines] = useState(
		defaultShowHierarchyLines
	);

	const onChangeShowFolderIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFolderHierarchyLines") {
			setShowHierarchyLines(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderIcon);

	return { showHierarchyLines };
};
