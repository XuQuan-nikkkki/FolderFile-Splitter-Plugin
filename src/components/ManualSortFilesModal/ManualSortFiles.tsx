import { TFile, TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import ManualSortContainer from "../ManualSort/Container";

import FileToSort from "./FileToSort";

type Props = {
	parentFolder: TFolder | null;
};
const ManualSortFiles = ({ parentFolder }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { getFilesInFolder, sortFiles, changeOrder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			order: store.filesManualSortOrder,
			getFilesInFolder: store.getFilesInFolder,
			sortFiles: store.sortFiles,
			changeOrder: store.moveFileInManualOrder,
		}))
	);

	const getSortedFiles = () => {
		if (!parentFolder) return [];
		const files = getFilesInFolder(parentFolder);
		return sortFiles(files);
	};

	if (!parentFolder) return null;

	const renderOverlayContent = (file: TFile) => {
		if (!file) return null;
		return (
			<div className="ffs__sorting-item-container">
				<FileToSort file={file} />
			</div>
		);
	};

	const items = getSortedFiles().map((file) => file.path);
	return (
		<ManualSortContainer
			items={items}
			changeOrder={changeOrder}
			renderOverlay={renderOverlayContent}
		>
			{getSortedFiles().map((file) => (
				<FileToSort key={file.path} file={file} />
			))}
		</ManualSortContainer>
	);
};

export default ManualSortFiles;
