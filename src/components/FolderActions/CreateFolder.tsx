import { useShallow } from "zustand/react/shallow";

import { AddFolderIcon } from "src/assets/icons";
import { FileTreeStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { useFileTree } from "../FileTree";

const CreateFolder = () => {
	const { useFileTreeStore } = useFileTree();

	const { rootFolder, focusedFolder, createNewFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			rootFolder: store.rootFolder,
			focusedFolder: store.focusedFolder,
			createNewFolder: store.createNewFolder,
		}))
	);

	const onCreateFolder = async () => {
		if (!rootFolder) return;
		const parentFolder = focusedFolder ? focusedFolder : rootFolder;
		await createNewFolder(parentFolder);
	};

	return (
		<StyledActionIconWrapper onClick={onCreateFolder}>
			<AddFolderIcon />
		</StyledActionIconWrapper>
	);
};

export default CreateFolder;
