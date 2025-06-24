import { TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { EmptyFolderIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { ExplorerStore } from "src/store";

import File from "../File";

import PinnedFiles from "./PinnedFiles";

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
	const { files } = useChangeFile();

	const renderFile = (file: TFile, disableDrag?: boolean) => (
		<File
			key={file.path}
			file={file}
			disableDrag={disableDrag}
			onOpenFoldersPane={onOpenFoldersPane}
		/>
	);

	if (!files.length) {
		return (
			<div className="ffs__file-tree--empty">
				<EmptyFolderIcon className="ffs__empty-file-tree-icon" />
			</div>
		);
	}

	const sortedFiles = sortFiles(files, fileSortRule);
	return (
		<div className="ffs__tree ffs__file-tree nav-files-container">
			<PinnedFiles renderFile={renderFile} />
			{sortedFiles.map((file) => renderFile(file))}
		</div>
	);
};

export default FileTree;
