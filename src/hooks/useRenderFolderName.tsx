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
	options?: Options
) => {
	const { isRoot, isFocused } = options ?? {};
	const folderName = isRoot ? plugin.app.vault.getName() : folder.name;

	const onSaveName = async (name: string) => {
		const newPath = folder.path.replace(folder.name, name);
		await plugin.app.vault.rename(folder, newPath);
	};

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
