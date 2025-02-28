import { useState } from "react";

import { ExpandFolderByClickingOnElement } from "src/settings";
import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useExpandFolderByClickingOnElement = (
	defaultClickingOnElement: ExpandFolderByClickingOnElement
): { expandFolderByClickingOn: ExpandFolderByClickingOnElement } => {
	const [expandFolderByClickingOn, setExpandFolderByClickingOn] = useState(
		defaultClickingOnElement
	);

	const onChangeShowFolderIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "expandFolderByClickingOn") {
			setExpandFolderByClickingOn(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderIcon);

	return { expandFolderByClickingOn };
};
