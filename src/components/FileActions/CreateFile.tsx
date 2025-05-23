import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";
import classNames from "classnames";
import { useShowFolderView } from "src/hooks/useSettingsHandler";

const CreateFile = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin

	const {
		createFile,
		focusedFolder,
		rootFolder,
		initOrder,
		focusedTag,
		getNameOfFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			createFile: store.createFile,
			focusedFolder: store.focusedFolder,
			rootFolder: store.rootFolder,
			initOrder: store.initFilesManualSortOrder,
			focusedTag: store.focusedTag,
			getNameOfFolder: store.getNameOfFolder,
		}))
	);

	const { showFolderView } = useShowFolderView(
		plugin.settings.showFolderView
	);

	const onCreateNewFile = async () => {
		if (focusedTag) return;
		const targetFolder = focusedFolder || rootFolder;
		if (!targetFolder) return;
		await createFile(targetFolder);
		await initOrder();
	};

	const getClassNames = () => {
		return classNames(
			"ffs__action-button-wrapper clickable-icon nav-action-button",
			{
				"ffs__action-button-wrapper--disabled":
					focusedTag || !showFolderView,
			}
		);
	};

	const getAriaLabel = () => {
		const targetFolder = focusedFolder || rootFolder;
		if (!targetFolder) return "";
		const folderName = getNameOfFolder(targetFolder);
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
