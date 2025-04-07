import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import classNames from "classnames";

import { ExplorerStore } from "src/store";
import { useIncludeSubfolderFilesCount } from "src/hooks/useSettingsHandler";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";
import { useEffect, useState } from "react";
import { useExplorer } from "src/hooks/useExplorer";

type Props = {
	folder: TFolder;
	isFocused: boolean;
};
const FilesCount = ({ folder, isFocused }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { getFilesCountInFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
		}))
	);
	const [count, setCount] = useState<number | null>(null);

	const { settings } = plugin;
	const { includeSubfolderFilesCount } = useIncludeSubfolderFilesCount(
		settings.includeSubfolderFilesCount
	);

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file, changeType } = event.detail;
		if (!isFile(file)) return;
		if (changeType === "delete" || changeType === "rename") {
			setCount(getFilesCountInFolder(folder, includeSubfolderFilesCount));
		}
	};

	useEffect(() => {
		setCount(getFilesCountInFolder(folder, includeSubfolderFilesCount));
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [folder]);

	useEffect(() => {
		setCount(getFilesCountInFolder(folder, includeSubfolderFilesCount));
	}, [folder.children.length, includeSubfolderFilesCount]);

	return (
		<div
			className={classNames("ffs__files-count", {
				"ffs__files-count--focused": isFocused,
			})}
		>
			{count}
		</div>
	);
};

export default FilesCount;
