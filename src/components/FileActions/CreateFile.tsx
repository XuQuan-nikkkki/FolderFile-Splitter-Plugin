import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";
import classNames from "classnames";

const CreateFile = () => {
	const { useExplorerStore } = useExplorer();

	const { createFile, focusedFolder, rootFolder, initOrder, focusedTag } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				createFile: store.createFile,
				focusedFolder: store.focusedFolder,
				rootFolder: store.rootFolder,
				initOrder: store.initFilesManualSortOrder,
				focusedTag: store.focusedTag,
			}))
		);

	const onCreateNewFile = async () => {
		if (focusedTag) return;
		const targetFolder = focusedFolder || rootFolder;
		if (!targetFolder) return;
		await createFile(targetFolder);
		await initOrder();
	};

	return (
		<div
			className={classNames(
				"ffs__action-button-wrapper clickable-icon nav-action-button",
				{
					"ffs__action-button-wrapper--disabled": focusedTag,
				}
			)}
			onClick={onCreateNewFile}
		>
			<AddFileIcon className="ffs__action-button svg-icon" />
		</div>
	);
};

export default CreateFile;
