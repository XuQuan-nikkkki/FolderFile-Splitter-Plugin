import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";

import { FileTreeStore } from "src/store";
import { EmptyFolderIcon } from "src/assets/icons";

import File from "./File";
import FolderFileSplitterPlugin from "src/main";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { TFile } from "obsidian";

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
	const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);

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
					fileList={sortedFiles}
					selectedFiles={selectedFiles}
					setSelectedFiles={setSelectedFiles}
				/>
			))}
		</>
	);
};

export default Files;
