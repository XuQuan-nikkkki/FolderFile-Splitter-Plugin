import { TFolder } from "obsidian";

import FolderFileSplitterPlugin from "src/main";
import useRenderEditableName from "src/hooks/useRenderEditableName";

const useRenderFolderName = (
	folder: TFolder,
	plugin: FolderFileSplitterPlugin,
	isRoot?: boolean
) => {
	const folderName = isRoot ? plugin.app.vault.getName() : folder.name;

	const getFolderNameClassNames = (isEditing: boolean): string => {
		return (
			"ffs-folder-name" + (isEditing ? " ffs-folder-name-edit-mode" : "")
		);
	};

	const onSaveName = async (name: string) => {
		const newPath = folder.path.replace(folder.name, name);
		await plugin.app.vault.rename(folder, newPath);
	};

	const {
		renderEditableName: renderFolderName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(folderName, onSaveName, getFolderNameClassNames);

	return {
		renderFolderName,
		selectFileNameText,
		onBeginEdit,
	};
};

export default useRenderFolderName;
