import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import { useIncludeSubfolderFilesCount } from "src/hooks/useSettingsHandler";
import { useFileTree } from "./FileTree";

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
