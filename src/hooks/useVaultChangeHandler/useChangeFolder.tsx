import { TFolder } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { ExplorerStore } from "src/store";
import { FOLDER_MANUAL_SORT_RULE } from "src/store/folder/sort";
import { isFolder } from "src/utils";

import { useExplorer } from "../useExplorer";

const useChangeFolder = () => {
	const { useExplorerStore } = useExplorer();

	const {
		getTopLevelFolders,
		folderSortRule,
		initOrder,
		isFolderPinned,
		unpinFolder,
		updatePinnedFolderPath,
		updateFolderPathInManualOrder,
		sortFolders,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getTopLevelFolders: store.getTopLevelFolders,
			folderSortRule: store.folderSortRule,
			initOrder: store.initFoldersManualSortOrder,
			isFolderPinned: store.isFolderPinned,
			unpinFolder: store.unpinFolder,
			updatePinnedFolderPath: store.updatePinnedFolderPath,
			updateFolderPathInManualOrder: store.updateFolderPathInManualOrder,
			sortFolders: store.sortFolders,
		}))
	);

	const [topFolders, setTopFolders] = useState<TFolder[]>([]);

	const onUpdateTopFolders = () => {
		const topLevelFolders = sortFolders(getTopLevelFolders());
		setTopFolders(topLevelFolders);
	};

	useEffect(() => {
		onUpdateTopFolders();
	}, []);

	useEffect(() => {
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [topFolders]);

	const onDeleteFolderFromList = (folder: TFolder) => {
		setTopFolders((prevFolders) =>
			prevFolders.filter((prevFolder) => prevFolder.path !== folder.path)
		);
	};

	const maybeInitOrder = async () => {
		if (folderSortRule !== FOLDER_MANUAL_SORT_RULE) return;
		await initOrder();
	};

	const onHandleVaultChange = async (event: VaultChangeEvent) => {
		const { file: folder, changeType, oldPath } = event.detail;
		if (!isFolder(folder)) return;
		const parentPath = folder.parent?.path;

		switch (changeType) {
			case "create":
				await maybeInitOrder();
				if (folder.parent?.isRoot()) {
					setTopFolders((prevFolders) => [...prevFolders, folder]);
				}
				break;
			case "delete":
				await maybeInitOrder();
				if (isFolderPinned(folder)) {
					await unpinFolder(folder);
				}
				onDeleteFolderFromList(folder);
				break;
			case "rename":
				onUpdateTopFolders();
				if (!oldPath) return;
				await updatePinnedFolderPath(oldPath, folder.path);
				if (!parentPath || folderSortRule !== FOLDER_MANUAL_SORT_RULE)
					return;
				await updateFolderPathInManualOrder(
					parentPath,
					oldPath,
					folder.path
				);
				break;
			case "modify":
				onUpdateTopFolders();
				break;
		}
	};

	return { topFolders };
};

export default useChangeFolder;
