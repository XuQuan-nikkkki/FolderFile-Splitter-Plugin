import { TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { useIncludeSubfolderFilesCount } from "src/hooks/useSettingsHandler";

const StyledCount = styled.div<{ $isFocused?: boolean }>`
	color: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "var(--text-muted)"};
	font-size: 12px;
	margin-left: 4px;
`;

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	isFocused: boolean;
};
const FilesCount = ({ folder, useFileTreeStore, plugin, isFocused }: Props) => {
	const { getFilesCountInFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
		}))
	);

	const { settings } = plugin;
	const { includeSubfolderFilesCount } = useIncludeSubfolderFilesCount(
		settings.includeSubfolderFilesCount
	);

	const filesCount = getFilesCountInFolder(
		folder,
		includeSubfolderFilesCount
	);
	return <StyledCount $isFocused={isFocused}>{filesCount}</StyledCount>;
};

export default FilesCount;
