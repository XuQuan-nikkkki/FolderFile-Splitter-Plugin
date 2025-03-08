import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { FileTreeStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
};
const CreateFile = ({ useFileTreeStore }: Props) => {
	const { createFile, focusedFolder, rootFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			createFile: store.createFile,
			focusedFolder: store.focusedFolder,
			rootFolder: store.rootFolder,
		}))
	);

	const onCreateNewFile = () => {
		const targetFolder = focusedFolder || rootFolder;
		if (!targetFolder) return;
		createFile(targetFolder);
	};

	return (
		<StyledActionIconWrapper onClick={onCreateNewFile}>
			<AddFileIcon />
		</StyledActionIconWrapper>
	);
};

export default CreateFile;
