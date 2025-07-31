import { useShallow } from "zustand/react/shallow";

import { EmptyFolderIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useDeduplicateTagFiles } from "src/hooks/useSettingsHandler";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { ExplorerStore } from "src/store";
import { isZh, Noop, uniq } from "src/utils";

import File from "../File";

import PinnedFiles from "./PinnedFiles";

type Props = {
	onOpenFoldersPane?: Noop;
};
const FileTree = ({ onOpenFoldersPane = () => {} }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { sortFiles } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			sortFiles: store.sortFiles,
			fileSortRule: store.fileSortRule,
			focusedFile: store.focusedFile,
			pinnedFiles: store.pinnedFilePaths,
			fileManualSortOrder: store.filesManualSortOrder,
		}))
	);
	const { files } = useChangeFile();
	const { deduplicateTagFiles } = useDeduplicateTagFiles(
		plugin.settings.deduplicateTagFiles
	);

	if (!files.length) {
		return (
			<div className="ffs__file-tree--empty">
				<EmptyFolderIcon className="ffs__empty-file-tree-icon" />
			</div>
		);
	}

	const sortedFiles = sortFiles(files);
	const deduplicatedFiles = uniq(sortedFiles);
	const hasDuplicateFiles = sortedFiles.length > deduplicatedFiles.length;
	const needToShowDeduplicate = deduplicateTagFiles && hasDuplicateFiles;

	let displayedFiles = sortedFiles;
	if (needToShowDeduplicate) {
		displayedFiles = deduplicatedFiles;
	}

	const renderDeduplicateTips = () => {
		if (!needToShowDeduplicate) return null;
		const tips = isZh
			? `${deduplicatedFiles.length} files shown(duplicates removed)`
			: `显示 ${deduplicatedFiles.length} 个文件（重复文件已省略）`;
		return <div className="ffs__deduplicate-tips">{tips}</div>;
	};

	return (
		<div className="ffs__tree ffs__file-tree nav-files-container">
			<PinnedFiles onOpenFoldersPane={onOpenFoldersPane} />
			{renderDeduplicateTips()}
			{displayedFiles.map((file, index) => (
				<File
					key={file.path + index}
					file={file}
					onOpenFoldersPane={onOpenFoldersPane}
				/>
			))}
		</div>
	);
};

export default FileTree;
