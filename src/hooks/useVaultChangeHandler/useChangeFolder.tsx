import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TFolder } from "obsidian";

import { FileTreeStore } from "src/store";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFolder } from "src/utils";
import { useFileTree } from "src/components/FileTree";

const useChangeFolder = () => {
	const { useFileTreeStore } = useFileTree();

	const { restoreExpandedFolderPaths, getTopLevelFolders } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			restoreExpandedFolderPaths: store.restoreExpandedFolderPaths,
			getTopLevelFolders: store.getTopLevelFolders,
		}))
	);

	const [topFolders, setTopFolders] = useState<TFolder[]>([]);

	const onUpdateTopFolders = () => {
		const topLevelFolders = getTopLevelFolders();
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

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file: folder, changeType } = event.detail;
		if (!isFolder(folder)) return;
		restoreExpandedFolderPaths();

		switch (changeType) {
			case "create":
				if (folder.parent?.isRoot()) {
					setTopFolders((prevFolders) => [...prevFolders, folder]);
				}
				break;
			case "delete":
				onDeleteFolderFromList(folder);
				break;
			case "rename":
				onUpdateTopFolders();
				break;
			case "modify":
				onUpdateTopFolders();
				break;
		}
	};

	return { topFolders };
};

export default useChangeFolder;
