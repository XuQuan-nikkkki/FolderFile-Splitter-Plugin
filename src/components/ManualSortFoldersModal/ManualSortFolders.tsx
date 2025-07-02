import { TFolder } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import ManualSortContainer from "../ManualSort/Container";

import FoldersBreadcrumbs from "./Breadcrumbs";
import FolderToSort from "./FolderToSort";

type Props = {
	parentFolder: TFolder | null;
};
const ManualSortFolders = ({ parentFolder }: Props) => {
	const { useExplorerStore } = useExplorer();

	const {
		getSubFolders,
		sortFolders,
		moveFolderInManualOrder,
		rootFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getSubFolders: store.getSubFolders,
			sortFolders: store.sortFolders,
			moveFolderInManualOrder: store.moveFolderInManualOrder,
			rootFolder: store.rootFolder,
			// for dependency tracking only
			foldersOrder: store.foldersManualSortOrder
		}))
	);

	const [currentFolder, setCurrentFolder] = useState<TFolder | null>(
		rootFolder
	);

	useEffect(() => {
		const targetFolder = parentFolder ?? rootFolder;
		setCurrentFolder(targetFolder);
	}, []);

	const getSortedFolders = () => {
		if (!currentFolder) return [];
		return sortFolders(getSubFolders(currentFolder));
	};

	if (!currentFolder) return null;

	const renderOverlayContent = (folder: TFolder) => {
		if (!folder) return null;
		return (
			<div className="ffs__sorting-item-container">
				<FolderToSort folder={folder} goInToFolder={setCurrentFolder} />
			</div>
		);
	};

	const renderBreadcrumbs = () => (
		<div className="ffs__manual-sort-breadcrumbs-container">
			<FoldersBreadcrumbs
				folder={currentFolder}
				setFolder={setCurrentFolder}
			/>
		</div>
	);

	const sortedFolders = getSortedFolders();
	const items = sortedFolders.map((folder) => folder.path);
	return (
		<ManualSortContainer
			items={items}
			changeOrder={moveFolderInManualOrder}
			renderOverlay={renderOverlayContent}
			breadcrumbs={renderBreadcrumbs()}
		>
			{sortedFolders.map((f) => (
				<FolderToSort
					key={f.path}
					folder={f}
					goInToFolder={setCurrentFolder}
				/>
			))}
		</ManualSortContainer>
	);
};

export default ManualSortFolders;
