import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";

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
		<div className="ffs__action-button-wrapper" onClick={onCreateNewFile}>
			<AddFileIcon className="ffs__action-button" />
		</div>
	);
};

export default CreateFile;
