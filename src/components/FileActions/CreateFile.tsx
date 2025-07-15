import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { ACTION_BUTTON_WRAPPER_CLASS_NAME } from "src/assets/constants";
import { AddFileIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

const CreateFile = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		createFileWithDefaultName,
		getNameOfFolder,
		focusedFolder,
		isCreateFileAbled,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			createFileWithDefaultName: store.createFileWithDefaultName,
			getNameOfFolder: store.getNameOfFolder,
			focusedFolder: store.focusedFolder,
			isCreateFileAbled: store.isCreateFileAbled,
		}))
	);

	const onCreateNewFile = async () => {
		if (!isCreateFileAbled() || !focusedFolder) return;
		await createFileWithDefaultName(focusedFolder);
	};

	const getClassNames = () => {
		return classNames(ACTION_BUTTON_WRAPPER_CLASS_NAME, {
			"ffs__action-button-wrapper--disabled": !isCreateFileAbled(),
		});
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
