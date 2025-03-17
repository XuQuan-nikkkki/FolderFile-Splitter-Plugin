import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { FileTreeStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { useFileTree } from "../FileTree";

const CreateFile = () => {
	const { useFileTreeStore } = useFileTree();

	const { createFile, focusedFolder, rootFolder, initOrder } =
		useFileTreeStore(
			useShallow((store: FileTreeStore) => ({
				createFile: store.createFile,
				focusedFolder: store.focusedFolder,
				rootFolder: store.rootFolder,
				initOrder: store.initFilesManualSortOrder,
			}))
		);

	const onCreateNewFile = async () => {
		const targetFolder = focusedFolder || rootFolder;
		if (!targetFolder) return;
		await createFile(targetFolder);
		await initOrder();
	};

	return (
		<StyledActionIconWrapper onClick={onCreateNewFile}>
			<AddFileIcon />
		</StyledActionIconWrapper>
	);
};

export default CreateFile;
