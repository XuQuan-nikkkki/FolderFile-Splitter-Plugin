import { useEffect, useState } from "react";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import { useShowFilesCount } from "src/hooks/useSettingsHandler";
import { isFile } from "src/utils";

type Props = {
	getFilesCount: () => number;
	includeSubItemFiles: boolean;
	childrenLen: number;
};
const FilesCount = ({
	getFilesCount,
	includeSubItemFiles,
	childrenLen,
}: Props) => {
	const { plugin } = useExplorer();
	const { settings } = plugin;

	const { showFilesCount } = useShowFilesCount(settings.showFilesCount);

	const [count, setCount] = useState<number | null>(null);

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file, changeType } = event.detail;
		if (!isFile(file)) return;
		if (["create", "delete", "rename"].includes(changeType)) {
			setCount(getFilesCount());
		}
	};

	useEffect(() => {
		setCount(getFilesCount());
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, []);

	useEffect(() => {
		setCount(getFilesCount());
	}, [childrenLen, includeSubItemFiles]);

	return (
		<div className="ffs__files-count">{showFilesCount ? count : ""}</div>
	);
};

export default FilesCount;
