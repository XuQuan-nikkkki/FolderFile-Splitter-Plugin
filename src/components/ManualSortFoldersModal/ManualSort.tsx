import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { FileTreeStore } from "src/store";
import { StoreApi, UseBoundStore } from "zustand";
import FolderFileSplitterPlugin from "src/main";
import FolderToSort, { StyledButton } from "./FolderToSort";
import styled from "styled-components";
import { Fragment, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const StyledFoldersList = styled.div`
	overflow-y: auto;
	height: 50vh;

	display: flex;
	flex-direction: column;
	gap: 8px;
`;
const StyledAction = styled.div`
	width: 100%;
	background-color: var(--interactive-normal);
	border-radius: var(--ffs-border-radius);
	padding: 8px 16px;
`;
const StyledPanel = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

type Props = {
	parentFolder: TFolder | null;
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
};
const ManualSort = ({ parentFolder, useFileTreeStore, plugin }: Props) => {
	const { getFoldersByParent, sortFolders, folderSortRule } =
		useFileTreeStore(
			useShallow((store: FileTreeStore) => ({
				getFoldersByParent: store.getFoldersByParent,
				sortFolders: store.sortFolders,
				folderSortRule: store.folderSortRule,
				order: store.foldersManualSortOrder,
			}))
		);

	const [folder, setFolder] = useState<TFolder | null>(null);

	useEffect(() => {
		const targetFolder = parentFolder ?? plugin.app.vault.getRoot();
		setFolder(targetFolder);
	}, []);

	const goInToFolder = (folder: TFolder | null) => {
		if (!folder) return;
		setFolder(folder);
	};

	const renderSlashSign = () => <span> / </span>;

	const renderBreadcrumbs = () => {
		if (!folder) return null;
		if (folder.isRoot()) {
			return (
				<StyledButton $disabled>
					{plugin.app.vault.getName()}
				</StyledButton>
			);
		}
		const crumbs = folder.path.split("/");
		const rootFolder = plugin.app.vault.getRoot();
		return (
			<>
				<StyledButton onClick={() => goInToFolder(rootFolder)}>
					{plugin.app.vault.getName()}
				</StyledButton>
				{renderSlashSign()}
				{crumbs.map((crumb, index) => {
					const path = crumbs.slice(0, index + 1).join("/");
					const target = plugin.app.vault.getFolderByPath(path);
					return (
						<Fragment key={crumb + index}>
							{index > 0 && renderSlashSign()}
							<StyledButton
								$disabled={index === crumbs.length - 1}
								onClick={() => goInToFolder(target)}
							>
								{crumb}
							</StyledButton>
						</Fragment>
					);
				})}
			</>
		);
	};

	if (!folder) return null;

	const sortedFolders = sortFolders(
		getFoldersByParent(folder),
		folderSortRule,
		false
	);
	return (
		<DndProvider backend={HTML5Backend}>
			<StyledPanel>
				<StyledAction>{renderBreadcrumbs()}</StyledAction>
				<StyledFoldersList>
					{sortedFolders.map((folder) => (
						<FolderToSort
							key={folder.path}
							folder={folder}
							useFileTreeStore={useFileTreeStore}
							goInToFolder={goInToFolder}
						/>
					))}
				</StyledFoldersList>
			</StyledPanel>
		</DndProvider>
	);
};

export default ManualSort;
