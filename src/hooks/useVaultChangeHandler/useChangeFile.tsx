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
		fileSortRule,
		focusedFolder,
		focusedTag,
		updatePinnedFilePath,
		isFilePinned,
		unpinFile,
		getVisibleFiles,
		viewMode,
		initOrder,
		updateOrder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			focusedTag: store.focusedTag,
			updatePinnedFilePath: store.updatePinnedFilePath,
			isFilePinned: store.isFilePinned,
			unpinFile: store.unpinFile,
			getVisibleFiles: store.getVisibleFiles,
			viewMode: store.viewMode,
			fileSortRule: store.fileSortRule,
			order: store.filesManualSortOrder,
			initOrder: store.initFilesManualSortOrder,
			updateOrder: store.updateFilePathInManualOrder,
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
	}, [
		focusedFolder,
		includeSubfolderFiles,
		focusedTag,
		includeSubTagFiles,
		viewMode,
	]);

	const maybeInitOrder = async () => {
		if (fileSortRule === FILE_MANUAL_SORT_RULE) {
			await initOrder();
		}
	};

	const onHandleVaultChange = async (event: VaultChangeEvent) => {
		const { file, changeType, oldPath } = event.detail;
		if (!isFile(file) || changeType === "modify") return;

		setFiles(getVisibleFiles());
		if (changeType === "create") {
			await maybeInitOrder();
		} else if (changeType === "delete" && isFilePinned(file)) {
			await maybeInitOrder();
			await unpinFile(file);
		} else if (changeType === "rename" && oldPath) {
			await updatePinnedFilePath(oldPath, file.path);
			const parentPath = file.parent?.path;
			if (parentPath) {
				await updateOrder(parentPath, oldPath, file.path);
			}
		}
	};

	return {
		files,
	};
};

export default useChangeFile;
