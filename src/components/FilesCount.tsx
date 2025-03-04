import { TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { useIncludeSubfolderFilesCount } from "src/hooks/useSettingsHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
};
const FilesCount = ({ folder, useFileTreeStore, plugin }: Props) => {
	const { getFilesCountInFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
		}))
	);

	const { settings } = plugin;
	const { includeSubfolderFilesCount } = useIncludeSubfolderFilesCount(
		settings.includeSubfolderFilesCount
	);

	const filesCount = getFilesCountInFolder(
		folder,
		includeSubfolderFilesCount
	);
	return <span className="ffs-files-count">{filesCount}</span>;
};

export default FilesCount;
