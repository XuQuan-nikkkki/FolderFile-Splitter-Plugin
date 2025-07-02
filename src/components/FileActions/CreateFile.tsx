import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { AddFileIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useShowFolderView } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";

const CreateFile = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		createFileWithDefaultName,
		initOrder,
		focusedTag,
		getNameOfFolder,
		getTargetFolder
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			createFileWithDefaultName: store.createFileWithDefaultName,
			initOrder: store.initFilesManualSortOrder,
			focusedTag: store.focusedTag,
			getNameOfFolder: store.getNameOfFolder,
			getTargetFolder: store.getTargetFolder
		}))
	);

	const { showFolderView } = useShowFolderView(
		plugin.settings.showFolderView
	);

	const targetFolder = getTargetFolder()

	const onCreateNewFile = async () => {
		if (focusedTag) return;
		await createFileWithDefaultName(targetFolder);
		// TODO: 修改处理 order 的逻辑
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
