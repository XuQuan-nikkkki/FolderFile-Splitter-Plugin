import { TFolder } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useIncludeSubfolderFiles,
	useShowFilesCount,
} from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { isFile } from "src/utils";

type Props = {
	folder: TFolder;
};
const FilesCount = ({ folder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { getFilesCountInFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
		}))
	);

	const { includeSubfolderFiles } = useIncludeSubfolderFiles(
		settings.includeSubfolderFiles
	);
	const { showFilesCount } = useShowFilesCount(settings.showFilesCount);

	const [count, setCount] = useState<number | null>(null);

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

	return (
		<div className="ffs__files-count">{showFilesCount ? count : ""}</div>
	);
};

export default FilesCount;
