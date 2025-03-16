import { TFolder } from "obsidian";

import FolderFileSplitterPlugin from "src/main";
import useRenderEditableName from "src/hooks/useRenderEditableName";

type Options = {
	isRoot?: boolean;
	isFocused?: boolean;
};
const useRenderFolderName = (
	folder: TFolder,
	plugin: FolderFileSplitterPlugin,
	onSaveName: (name: string) => Promise<void>,
	options?: Options
) => {
	const { isRoot, isFocused } = options ?? {};
	const folderName = isRoot ? plugin.app.vault.getName() : folder.name;

	const {
		renderEditableName: renderFolderName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(folderName, onSaveName, {
		isFocused,
		isLarge: isRoot,
		isBold: isRoot,
	});

	return {
		renderFolderName,
		selectFileNameText,
		onBeginEdit,
	};
};

export default useRenderFolderName;
