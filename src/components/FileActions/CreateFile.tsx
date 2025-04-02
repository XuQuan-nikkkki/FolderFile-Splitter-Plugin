import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { useExplorer } from "../Explorer";

const CreateFile = () => {
	const { useExplorerStore } = useExplorer();

	const { createFile, focusedFolder, rootFolder, initOrder } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
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
