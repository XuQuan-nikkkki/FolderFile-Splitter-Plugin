import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import { useIncludeSubfolderFilesCount } from "src/hooks/useSettingsHandler";
import { useFileTree } from "./FileTree";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";
import { useEffect, useState } from "react";

const StyledCount = styled.div<{ $isFocused?: boolean }>`
	color: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "var(--text-muted)"};
	font-size: 12px;
	margin-left: 4px;
`;

type Props = {
	folder: TFolder;
	isFocused: boolean;
};
const FilesCount = ({ folder, isFocused }: Props) => {
	const { useFileTreeStore, plugin } = useFileTree();

	const { getFilesCountInFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
		if (changeType === "delete") {
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

	return <StyledCount $isFocused={isFocused}>{count}</StyledCount>;
};

export default FilesCount;
