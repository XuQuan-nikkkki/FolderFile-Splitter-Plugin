import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import { TFolder } from "obsidian";

import { FileTreeStore } from "src/store";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFolder } from "src/utils";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
};
const useChangeFolder = ({ useFileTreeStore }: Props) => {
	const { restoreExpandedFolderPaths, getTopLevelFolders } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			restoreExpandedFolderPaths: store.restoreExpandedFolderPaths,
			getTopLevelFolders: store.getTopLevelFolders,
		}))
	);

	const [topFolders, setTopFolders] = useState<TFolder[]>([]);

	useEffect(() => {
		const topLevelFolders = getTopLevelFolders();
		setTopFolders(topLevelFolders);
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, []);

	const onDeleteFolderFromList = (folder: TFolder) => {
		setTopFolders((prevFolders) =>
			prevFolders.filter((prevFolder) => prevFolder.path !== folder.path)
		);
	};

	const onUpdateFolderInList = (folder: TFolder) => {
		setTopFolders((prevFolders) =>
			prevFolders.map((prevFolder) =>
				prevFolder.path === folder.path ? folder : prevFolder
			)
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
				onUpdateFolderInList(folder);
				break;
			case "modify":
				onUpdateFolderInList(folder);
				break;
		}
	};

	return { topFolders };
};

export default useChangeFolder;
