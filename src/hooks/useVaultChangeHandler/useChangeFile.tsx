import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";

import { FileTreeStore } from "src/store";

import { TFile } from "obsidian";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
};
const useChangeFile = ({ useFileTreeStore }: Props) => {
	const { focusedFolder, getDirectFilesInFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFolder: store.focusedFolder,
			getDirectFilesInFolder: store.getDirectFilesInFolder,
		}))
	);
	const defaultFiles: TFile[] = focusedFolder
		? getDirectFilesInFolder(focusedFolder)
		: [];
	const [files, setFiles] = useState<TFile[]>(defaultFiles);

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

	return {
		files,
		onDeleteFileFromList,
	};
};

export default useChangeFile;
