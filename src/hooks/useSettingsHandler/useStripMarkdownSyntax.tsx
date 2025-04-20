import { useState } from "react";

import { useWatchSettingsChange } from "./useWatchSettingsChange";

export const useStripMarkdownSyntaxInPreview = (
	defaultStrip: boolean
): { stripMarkdownSyntaxInPreview: boolean } => {
	const [stripSyntax, setStripSyntax] = useState(defaultStrip);

	const onChangeStripSyntax = (event: CustomEvent) => {
		const { changeKey, changeValue } = event.detail;
		if (changeKey == "stripMarkdownSyntaxInPreview") {
			setStripSyntax(changeValue);
		}
	};

	useWatchSettingsChange(onChangeStripSyntax);

	return { stripMarkdownSyntaxInPreview: stripSyntax };
};
