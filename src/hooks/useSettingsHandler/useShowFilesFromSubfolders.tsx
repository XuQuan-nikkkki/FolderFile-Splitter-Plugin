import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useShowFilesFromSubfolders = (
	defaultValue: boolean
): { showFilesFromSubfolders: boolean } => {
	const [showFilesFromSubfolders, setShowFilesFromSubfolders] =
		useState<boolean>(defaultValue);

	const onChangeSetting = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "showFilesFromSubfolders") {
			setShowFilesFromSubfolders(changeValue);
		}
	};

	useWatchSettingsChange(onChangeSetting);

	return { showFilesFromSubfolders };
};
