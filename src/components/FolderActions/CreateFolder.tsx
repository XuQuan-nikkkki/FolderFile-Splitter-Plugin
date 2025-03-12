import { useShallow } from "zustand/react/shallow";

import { AddFolderIcon } from "src/assets/icons";
import { FileTreeStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { useFileTree } from "../FileTree";
import { TFolder } from "obsidian";

const CreateFolder = () => {
	const { useFileTreeStore } = useFileTree();

	const {
		rootFolder,
		focusedFolder,
		createNewFolder,
		changeExpandedFolderPaths,
		setFocusedFolder,
		expandedFolderPaths,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			rootFolder: store.rootFolder,
			focusedFolder: store.focusedFolder,
			createNewFolder: store.createNewFolder,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
		}))
	);

	const expandParentFolders = async (folder: TFolder) => {
		const { path } = folder;
		const pathParts = path.split("/");
		console.log("parts", pathParts);
		const parentPaths = [];
		for (let i = 0; i <= pathParts.length; i++) {
			const pathToExpand = pathParts.slice(0, i).join("/");
			console.log(i, pathToExpand);
			if (pathToExpand) {
				parentPaths.push(pathToExpand);
			}
		}
		console.log(parentPaths);
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
	};

	return (
		<StyledActionIconWrapper onClick={onCreateFolder}>
			<AddFolderIcon />
		</StyledActionIconWrapper>
	);
};

export default CreateFolder;
