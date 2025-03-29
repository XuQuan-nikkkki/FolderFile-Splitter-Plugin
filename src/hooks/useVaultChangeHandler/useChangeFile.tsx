import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TFile } from "obsidian";

import { FILE_MANUAL_SORT_RULE, FileTreeStore } from "src/store";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";
import { useFileTree } from "src/components/FileTree";
import { useShowFilesFromSubfolders } from "../useSettingsHandler";

const useChangeFile = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		focusedFolder,
		getFilesInFolder,
		updatePinStateAfterPathChange,
		updateFileManualOrder,
		fileSortRule,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFolder: store.focusedFolder,
			getFilesInFolder: store.getFilesInFolder,
			updatePinStateAfterPathChange: store.updatePinStateAfterPathChange,
			updateFileManualOrder: store.updateFileManualOrder,
			fileSortRule: store.fileSortRule,
		}))
	);

	const { showFilesFromSubfolders } = useShowFilesFromSubfolders(
		plugin.settings.showFilesFromSubfolders
	);
	const defaultFiles: TFile[] = focusedFolder
		? getFilesInFolder(focusedFolder, showFilesFromSubfolders)
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
	}, [focusedFolder, showFilesFromSubfolders]);

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

	const onHandleVaultChange = async (event: VaultChangeEvent) => {
		const { file, changeType, oldPath } = event.detail;
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
				if (oldPath) {
					const parentPath = file.parent?.path;
					await updatePinStateAfterPathChange(oldPath, file.path);
					if (parentPath && fileSortRule === FILE_MANUAL_SORT_RULE) {
						await updateFileManualOrder(
							parentPath,
							oldPath,
							file.path
						);
					}
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
