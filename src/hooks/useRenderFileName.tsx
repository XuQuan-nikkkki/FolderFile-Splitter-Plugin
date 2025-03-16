import { TFile } from "obsidian";

import useRenderEditableName from "src/hooks/useRenderEditableName";

type Options = {
	isFocused?: boolean;
};
const useRenderFileName = (
	file: TFile,
	onSaveName: (name: string) => Promise<void>,
	options: Options,
) => {
	const { isFocused } = options ?? { isFocused: false };
	const {
		renderEditableName: renderFileName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(file.basename, onSaveName, {
		isBold: true,
		isFocused,
	});

	return {
		renderFileName,
		selectFileNameText,
		onBeginEdit,
	};
};

export default useRenderFileName;
