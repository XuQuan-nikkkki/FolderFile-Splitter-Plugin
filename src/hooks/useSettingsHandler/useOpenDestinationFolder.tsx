import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useOpenDestinationFolder = (
	defaultOpen: boolean
): { openDestinationFolder: boolean } => {
	const [openDestinationFolder, setOpenDestinationFolder] =
		useState(defaultOpen);

	const onChangeShowFolderIcon = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "openDestinationFolderAfterMove") {
			setOpenDestinationFolder(changeValue);
		}
	};

	useWatchSettingsChange(onChangeShowFolderIcon);

	return { openDestinationFolder };
};
