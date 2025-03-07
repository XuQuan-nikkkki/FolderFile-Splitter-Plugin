import { Fragment, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";

import { FileTreeStore } from "src/store";
import { EmptyFolderIcon } from "src/assets/icons";

import DraggableFile from "./DraggableFile";
import FolderFileSplitterPlugin from "src/main";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { TFile } from "obsidian";
import PinIcon from "src/assets/icons/PinIcon";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const Files = ({ useFileTreeStore, plugin }: Props) => {
	const { sortFiles, fileSortRule, focusedFile } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			sortFiles: store.sortFiles,
			fileSortRule: store.fileSortRule,
			focusedFile: store.focusedFile,
			pinnedFiles: store.pinnedFilePaths,
			FileManualSortOrder: store.filesManualSortOrder
		}))
	);
	const { files, onDeleteFileFromList } = useChangeFile({ useFileTreeStore });
	const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
	const [draggingFiles, setDraggingFiles] = useState<TFile[]>([]);

	const filesRef = useRef<HTMLDivElement>(null);

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

	const renderFile = (file: TFile) => (
		<DraggableFile
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
	);

	const renderPinnedFiles = () => {
		const pinnedFilePaths = useFileTreeStore.getState().pinnedFilePaths;
		const pinnedFiles = files.filter((f) =>
			pinnedFilePaths.includes(f.path)
		);
		if (!pinnedFiles.length) return null;
		return (
			<div className="ffs-pinned-section">
				<span className="ffs-pinned-title">
					<PinIcon />
					Pin
				</span>
				<div className="ffs-pinned-content">
					{pinnedFiles.map(renderFile)}
				</div>
			</div>
		);
	};

	if (!files.length) return renderNoneFilesTips();
	const sortedFiles = sortFiles(files, fileSortRule);
	return (
		<Fragment>
			{renderPinnedFiles()}
			<div ref={filesRef}>{sortedFiles.map(renderFile)}</div>
		</Fragment>
	);
};

export default Files;
