import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { ACTION_BUTTON_WRAPPER_CLASS_NAME } from "src/assets/constants";
import { AddFolderIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useShowFolderView } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { isZh } from "src/utils";

const CreateFolder = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { showFolderView } = useShowFolderView(settings.showFolderView);
	const {
		rootFolder,
		focusedFolder,
		getNameOfFolder,
		getTargetFolder,
		createNewFolderAndFocus,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			rootFolder: store.rootFolder,
			focusedFolder: store.focusedFolder,
			getNameOfFolder: store.getNameOfFolder,
			getTargetFolder: store.getTargetFolder,
			createNewFolderAndFocus: store.createNewFolderAndFocus,
		}))
	);

	const onCreateFolder = async () => {
		if (!rootFolder) return;
		const parentFolder = getTargetFolder();
		await createNewFolderAndFocus(parentFolder);
	};

	const getClassNames = () => {
		return classNames(ACTION_BUTTON_WRAPPER_CLASS_NAME, {
			"ffs__action-button-wrapper--disabled": !showFolderView,
		});
	};

	const getAriaLabel = () => {
		const parentFolder = focusedFolder ? focusedFolder : rootFolder;
		const folderName = getNameOfFolder(parentFolder);
		return isZh
			? `在 ${folderName} 中创建新文件夹`
			: `Create a new folder in ${folderName}`;
	};

	return (
		<div
			className={getClassNames()}
			onClick={onCreateFolder}
			data-tooltip-position="bottom"
			aria-label={getAriaLabel()}
		>
			<AddFolderIcon className="ffs__action-button svg-icon" />
		</div>
	);
};

export default CreateFolder;
