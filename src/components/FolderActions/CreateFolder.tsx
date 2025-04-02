import { useShallow } from "zustand/react/shallow";

import { AddFolderIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { useExplorer } from "../Explorer";
import { TFolder } from "obsidian";

const CreateFolder = () => {
	const { useExplorerStore } = useExplorer();

	const {
		rootFolder,
		focusedFolder,
		createNewFolder,
		changeExpandedFolderPaths,
		setFocusedFolder,
		expandedFolderPaths,
		initOrder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			rootFolder: store.rootFolder,
			focusedFolder: store.focusedFolder,
			createNewFolder: store.createNewFolder,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			initOrder: store.initFoldersManualSortOrder,
		}))
	);

	const expandParentFolders = async (folder: TFolder) => {
		const { path } = folder;
		const pathParts = path.split("/");
		const parentPaths = [];
		for (let i = 0; i <= pathParts.length; i++) {
			const pathToExpand = pathParts.slice(0, i).join("/");
			if (pathToExpand) {
				parentPaths.push(pathToExpand);
			}
		}
		const pathsToExpand = [
			...new Set([...expandedFolderPaths, ...parentPaths]),
		];
		await changeExpandedFolderPaths(pathsToExpand);
	};

	const onCreateFolder = async () => {
		if (!rootFolder) return;
		const parentFolder = focusedFolder ? focusedFolder : rootFolder;
		const newFolder = await createNewFolder(parentFolder);
		if (newFolder) {
			await expandParentFolders(parentFolder);
			await setFocusedFolder(newFolder);
		}
		await initOrder();
	};

	return (
		<StyledActionIconWrapper onClick={onCreateFolder}>
			<AddFolderIcon />
		</StyledActionIconWrapper>
	);
};

export default CreateFolder;
