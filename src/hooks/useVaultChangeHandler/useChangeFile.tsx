import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { ExplorerStore } from "src/store";
import { FILE_MANUAL_SORT_RULE } from "src/store/file/sort";
import { isFile } from "src/utils";

import { useExplorer } from "../useExplorer";
import {
	useIncludeSubfolderFiles,
	useIncludeSubTagFiles,
} from "../useSettingsHandler";

const useChangeFile = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		focusedFolder,
		focusedTag,
		updatePinnedFilePath,
		updateFilePathInManualOrder,
		fileSortRule,
		initOrder,
		isFilePinned,
		unpinFile,
		getVisibleFiles,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			focusedTag: store.focusedTag,
			updatePinnedFilePath: store.updatePinnedFilePath,
			updateFilePathInManualOrder: store.updateFilePathInManualOrder,
			fileSortRule: store.fileSortRule,
			initOrder: store.initFilesManualSortOrder,
			isFilePinned: store.isFilePinned,
			unpinFile: store.unpinFile,
			getVisibleFiles: store.getVisibleFiles,
		}))
	);

	const { settings } = plugin;
	const { includeSubfolderFiles } = useIncludeSubfolderFiles(
		settings.includeSubfolderFiles
	);
	const { includeSubTagFiles } = useIncludeSubTagFiles(
		settings.includeSubTagFiles
	);

	const [files, setFiles] = useState<TFile[]>(getVisibleFiles());

	useEffect(() => {
		setFiles(getVisibleFiles());
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [focusedFolder, includeSubfolderFiles, focusedTag, includeSubTagFiles]);

	const maybeInitOrder = async () => {
		if (fileSortRule !== FILE_MANUAL_SORT_RULE) return;
		await initOrder();
	};

	const updateFileList = async () => {
		setFiles(getVisibleFiles());
	};

	const updateFileListAndOrder = async () => {
		await maybeInitOrder()
		updateFileList()
	}

	const onHandleVaultChange = async (event: VaultChangeEvent) => {
		const { file, changeType, oldPath } = event.detail;
		if (!isFile(file)) return;

		switch (changeType) {
			case "create":
				await updateFileListAndOrder();
				break;
			case "delete":
				await updateFileListAndOrder();
				if (isFilePinned(file)) {
					await unpinFile(file);
				}
				break;
			case "rename":
				updateFileList();
				if (oldPath) {
					const parentPath = file.parent?.path;
					await updatePinnedFilePath(oldPath, file.path);
					if (parentPath && fileSortRule === FILE_MANUAL_SORT_RULE) {
						await updateFilePathInManualOrder(
							parentPath,
							oldPath,
							file.path
						);
					}
				}
				break;
			case "modify":
				updateFileList();
				break;
		}
	};

	return {
		files,
	};
};

export default useChangeFile;
