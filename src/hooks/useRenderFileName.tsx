import { TFile } from "obsidian";

import FolderFileSplitterPlugin from "src/main";
import useRenderEditableName from "src/hooks/useRenderEditableName";

type Options = {
	isFocused?: boolean;
};
const useRenderFileName = (
	file: TFile,
	plugin: FolderFileSplitterPlugin,
	beforeSaveName: (newPath: string) => Promise<void>,
	options: Options,
) => {
	const onSaveName = async (name: string) => {
		const newPath = file.path.replace(file.basename, name);
		await beforeSaveName(newPath);
		await plugin.app.vault.rename(file, newPath);
	};

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
