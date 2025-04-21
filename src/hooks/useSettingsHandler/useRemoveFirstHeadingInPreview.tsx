import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useRemoveFirstHeadingInPreview = (
	defaultRemove: boolean
): { removeFirstHeadingInPreview: boolean } => {
	const [remove, setRemove] = useState(defaultRemove);

	const onChangeRemove = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "removeFirstHeadingInPreview") {
			setRemove(changeValue);
		}
	};

	useWatchSettingsChange(onChangeRemove);

	return { removeFirstHeadingInPreview: remove };
};
