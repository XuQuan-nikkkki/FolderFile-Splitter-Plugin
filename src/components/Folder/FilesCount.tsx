import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useIncludeSubfolderFiles } from "src/hooks/useSettingsHandler";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";
import { useEffect, useState } from "react";
import { useExplorer } from "src/hooks/useExplorer";

type Props = {
	folder: TFolder;
};
const FilesCount = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { getFilesCountInFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
		}))
	);
	const [count, setCount] = useState<number | null>(null);

	const { settings } = plugin;
	const { includeSubfolderFiles } = useIncludeSubfolderFiles(
		settings.includeSubfolderFiles
	);

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file, changeType } = event.detail;
		if (!isFile(file)) return;
		if (changeType === "delete" || changeType === "rename") {
			setCount(getFilesCountInFolder(folder, includeSubfolderFiles));
		}
	};

	useEffect(() => {
		setCount(getFilesCountInFolder(folder, includeSubfolderFiles));
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [folder]);

	useEffect(() => {
		setCount(getFilesCountInFolder(folder, includeSubfolderFiles));
	}, [folder.children.length, includeSubfolderFiles]);

	return <div className="ffs__files-count">{count}</div>;
};

export default FilesCount;
