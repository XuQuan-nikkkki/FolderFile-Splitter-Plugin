import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

const CreateFile = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const { createFileWithDefaultName, getNameOfFolder, focusedFolder } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				createFileWithDefaultName: store.createFileWithDefaultName,
				getNameOfFolder: store.getNameOfFolder,
				focusedFolder: store.focusedFolder,
			}))
		);

	const onCreateNewFile = async () => {
		if (!focusedFolder) return;
		await createFileWithDefaultName(focusedFolder);
	};

	const getClassNames = () => {
		return classNames(
			"ffs__action-button-wrapper clickable-icon nav-action-button",
			{
				"ffs__action-button-wrapper--disabled": !focusedFolder,
			}
		);
	};

	const getAriaLabel = () => {
		if (!focusedFolder) return undefined;
		const folderName = getNameOfFolder(focusedFolder);
		if (language === "zh") {
			return `在 ${folderName} 中创建新笔记`;
		}
		return `Create a new file in ${folderName}`;
	};

	return (
		<div
			className={getClassNames()}
			onClick={onCreateNewFile}
			data-tooltip-position="bottom"
			aria-label={getAriaLabel()}
		>
			<AddFileIcon className="ffs__action-button svg-icon" />
		</div>
	);
};

export default CreateFile;
