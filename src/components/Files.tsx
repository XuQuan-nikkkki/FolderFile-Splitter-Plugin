import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";

import { FileTreeStore } from "src/store";
import { EmptyFolderIcon } from "src/assets/icons";

import File from "./File";
import FolderFileSplitterPlugin from "src/main";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const Files = ({ useFileTreeStore, plugin }: Props) => {
	const { restoreLastFocusedFile, sortFiles, fileSortRule } =
		useFileTreeStore(
			useShallow((store: FileTreeStore) => ({
				restoreLastFocusedFile: store.restoreLastFocusedFile,
				sortFiles: store.sortFiles,
				fileSortRule: store.fileSortRule,
			}))
		);
	const { files, onDeleteFileFromList } = useChangeFile({ useFileTreeStore });

	useEffect(() => {
		restoreLastFocusedFile();
	}, []);

	const renderNoneFilesTips = () => {
		return (
			<div className="ffs-none-files-tips">
				<EmptyFolderIcon />
			</div>
		);
	};

	if (!files.length) return renderNoneFilesTips();
	const sortedFiles = sortFiles(files, fileSortRule);
	return (
		<>
			{sortedFiles.map((file) => (
				<File
					key={file.name}
					useFileTreeStore={useFileTreeStore}
					file={file}
					plugin={plugin}
					deleteFile={() => onDeleteFileFromList(file)}
				/>
			))}
		</>
	);
};

export default Files;
