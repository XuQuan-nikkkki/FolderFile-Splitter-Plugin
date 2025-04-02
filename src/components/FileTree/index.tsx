import { useShallow } from "zustand/react/shallow";
import { TFile } from "obsidian";

import { ExplorerStore } from "src/store";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { useExplorer } from "src/hooks/useExplorer";

import File from "../File";
import PinnedFiles from "./PinnedFiles";
import { StyledEmptyFileTree, StyledEmptyIcon, StyledFileTree } from "./Styled";

type Props = {
	onOpenFoldersPane?: () => void;
};
const FileTree = ({ onOpenFoldersPane = () => {} }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { sortFiles, fileSortRule } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
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
			<StyledEmptyFileTree>
				<StyledEmptyIcon />
			</StyledEmptyFileTree>
		);
	}

	const sortedFiles = sortFiles(files, fileSortRule);
	return (
		<StyledFileTree>
			<PinnedFiles files={files} renderFile={renderFile} />
			{sortedFiles.map((file) => renderFile(file, sortedFiles))}
		</StyledFileTree>
	);
};

export default FileTree;
