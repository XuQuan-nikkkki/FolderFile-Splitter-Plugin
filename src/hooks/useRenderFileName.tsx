import { TFile } from "obsidian";

import FolderFileSplitterPlugin from "src/main";
import useRenderEditableName from "src/hooks/useRenderEditableName";

const useRenderFileName = (
	file: TFile,
	plugin: FolderFileSplitterPlugin,
	isFocused = false
) => {
	const onSaveName = async (name: string) => {
		const newPath = file.path.replace(file.name, name);
		await plugin.app.vault.rename(file, newPath);
	};

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
