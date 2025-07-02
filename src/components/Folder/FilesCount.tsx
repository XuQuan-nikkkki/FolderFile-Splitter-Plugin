import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useIncludeSubfolderFiles } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";

import FilesCount from "../FilesCount";

type Props = {
	folder: TFolder;
};
const FolderFilesCount = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { getFilesCountInFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
		}))
	);

	const { includeSubfolderFiles } = useIncludeSubfolderFiles(
		settings.includeSubfolderFiles
	);

	return (
		<FilesCount
			getFilesCount={() => getFilesCountInFolder(folder)}
			includeSubItemFiles={includeSubfolderFiles}
			childrenLen={folder.children.length}
		/>
	);
};

export default FolderFilesCount;
