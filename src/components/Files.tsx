import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";

import { FileTreeStore } from "src/store";
import { EmptyFolderIcon } from "src/assets/icons";

import File from "./File";
import FolderFileSplitterPlugin from "src/main";
import { TFile } from "obsidian";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const Files = ({ useFileTreeStore, plugin }: Props) => {
	const {
		focusedFolder,
		getDirectFilesInFolder,
		restoreLastFocusedFile,
		sortFiles,
		fileSortRule,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFolder: store.focusedFolder,
			getDirectFilesInFolder: store.getDirectFilesInFolder,
			restoreLastFocusedFile: store.restoreLastFocusedFile,
			sortFiles: store.sortFiles,
			fileSortRule: store.fileSortRule,
		}))
	);
	const defaultFiles: TFile[] = focusedFolder
		? getDirectFilesInFolder(focusedFolder)
		: [];
	const [files, setFiles] = useState<TFile[]>(defaultFiles);

	useEffect(() => {
		restoreLastFocusedFile();
	}, []);

	useEffect(() => {
		setFiles(defaultFiles);
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [focusedFolder]);

	const onDeleteFileFromList = (file: TFile) => {
		setFiles((prevFiles) =>
			prevFiles.filter((prevFile) => prevFile.path !== file.path)
		);
	};

	const onUpdateFileInList = (file: TFile) => {
		setFiles((prevFiles) =>
			prevFiles.map((prevFile) =>
				prevFile.path === file.path ? file : prevFile
			)
		);
	};

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file, changeType } = event.detail;
		if (!isFile(file)) return;

		switch (changeType) {
			case "create":
				if (focusedFolder && file.parent?.path == focusedFolder.path) {
					setFiles((prevFiles) => [...prevFiles, file]);
				}
				break;
			case "delete":
				onDeleteFileFromList(file);
				break;
			case "rename":
				if (!focusedFolder) return;
				if (file.parent?.path == focusedFolder.path) {
					onUpdateFileInList(file);
				} else {
					onDeleteFileFromList(file);
				}
				break;
			case "modify":
				onUpdateFileInList(file);
				break;
		}
	};

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
					deleteFile={() =>
						setFiles((prevFiles) =>
							prevFiles.filter(
								(prevFile) => prevFile.path !== file.path
							)
						)
					}
				/>
			))}
		</>
	);
};

export default Files;
