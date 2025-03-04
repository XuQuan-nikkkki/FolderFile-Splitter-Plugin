import { useEffect, useRef, useState } from "react";
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
	const { restoreLastFocusedFile, sortFiles, fileSortRule, focusedFile } =
		useFileTreeStore(
			useShallow((store: FileTreeStore) => ({
				restoreLastFocusedFile: store.restoreLastFocusedFile,
				sortFiles: store.sortFiles,
				fileSortRule: store.fileSortRule,
				focusedFile: store.focusedFile,
			}))
		);
	const { files, onDeleteFileFromList } = useChangeFile({ useFileTreeStore });
	const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
	const [draggingFiles, setDraggingFiles] = useState<TFile[]>([]);

	const filesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		restoreLastFocusedFile();
	}, []);

	const onClickOutside = (e: MouseEvent) => {
		if (filesRef?.current && !filesRef.current.contains(e.target as Node)) {
			setSelectedFiles(focusedFile ? [focusedFile] : []);
		}
	};

	useEffect(() => {
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [focusedFile]);

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
		<div ref={filesRef}>
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
					draggingFiles={draggingFiles}
					setDraggingFiles={setDraggingFiles}
				/>
			))}
		</div>
	);
};

export default Files;
