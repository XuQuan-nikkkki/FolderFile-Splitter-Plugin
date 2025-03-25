import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import { EmptyFolderIcon } from "src/assets/icons";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { TFile } from "obsidian";
import File from "./File";
import { useFileTree } from "./FileTree";
import PinnedFiles from "./PinnedFiles";

const StyledFiles = styled.div`
	flex: 1;
	overflow-y: auto;
`;

const StyledEmptyIcon = styled(EmptyFolderIcon)`
	width: 60px;
	height: 60px;
	fill: var(--text-faint);
`;

const NoneFilesTips = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

type Props = {
	onOpenFoldersPane?: () => void;
};
const Files = ({ onOpenFoldersPane = () => {} }: Props) => {
	const { useFileTreeStore } = useFileTree();

	const { sortFiles, fileSortRule } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			sortFiles: store.sortFiles,
			fileSortRule: store.fileSortRule,
			focusedFile: store.focusedFile,
			pinnedFiles: store.pinnedFilePaths,
			fileManualSortOrder: store.filesManualSortOrder,
		}))
	);
	const { files, onDeleteFileFromList } = useChangeFile();

	const renderFile = (
		file: TFile,
		fileList: TFile[],
		disableDrag?: boolean
	) => (
		<File
			key={file.name}
			file={file}
			deleteFile={() => onDeleteFileFromList(file)}
			fileList={fileList}
			disableDrag={disableDrag}
			onOpenFoldersPane={onOpenFoldersPane}
		/>
	);

	if (!files.length) {
		return (
			<NoneFilesTips>
				<StyledEmptyIcon />
			</NoneFilesTips>
		);
	}

	const sortedFiles = sortFiles(files, fileSortRule);
	return (
		<StyledFiles>
			<PinnedFiles files={files} renderFile={renderFile} />
			{sortedFiles.map((file) => renderFile(file, sortedFiles))}
		</StyledFiles>
	);
};

export default Files;
