import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TFile } from "obsidian";

import { ExplorerStore } from "src/store";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";
import { useExplorer } from "../useExplorer";
import {
	useIncludeSubfolderFiles,
	useIncludeSubTagFiles,
} from "../useSettingsHandler";
import { FILE_MANUAL_SORT_RULE } from "src/store/file";

const useChangeFile = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		focusedFolder,
		focusedTag,
		updateFilePinState,
		updateFileManualOrder,
		fileSortRule,
		initOrder,
		isFilePinned,
		unpinFile,
		getFocusedFiles,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			focusedTag: store.focusedTag,
			updateFilePinState: store.updateFilePinState,
			updateFileManualOrder: store.updateFileManualOrder,
			fileSortRule: store.fileSortRule,
			initOrder: store.initFilesManualSortOrder,
			isFilePinned: store.isFilePinned,
			unpinFile: store.unpinFile,
			getFocusedFiles: store.getFocusedFiles,
		}))
	);

	const { settings } = plugin;
	const { includeSubfolderFiles } = useIncludeSubfolderFiles(
		settings.includeSubfolderFiles
	);
	const { includeSubTagFiles } = useIncludeSubTagFiles(
		settings.includeSubTagFiles
	);

	const [files, setFiles] = useState<TFile[]>(getFocusedFiles());

	useEffect(() => {
		setFiles(getFocusedFiles());
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [focusedFolder, includeSubfolderFiles, focusedTag, includeSubTagFiles]);

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

	const maybeInitOrder = async () => {
		if (fileSortRule !== FILE_MANUAL_SORT_RULE) return;
		await initOrder();
	};

	const onHandleVaultChange = async (event: VaultChangeEvent) => {
		const { file, changeType, oldPath } = event.detail;
		if (!isFile(file)) return;

		switch (changeType) {
			case "create":
				await maybeInitOrder();
				if (focusedFolder && file.parent?.path == focusedFolder.path) {
					setFiles((prevFiles) => [...prevFiles, file]);
				}
				break;
			case "delete":
				await maybeInitOrder();
				if (isFilePinned(file)) {
					await unpinFile(file);
				}
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
					await updateFilePinState(oldPath, file.path);
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
