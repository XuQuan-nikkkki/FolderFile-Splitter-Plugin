import classNames from "classnames";
import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { AddFolderIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useShowFolderView } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { uniq } from "src/utils";

const CreateFolder = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings, language } = plugin;

	const { showFolderView } = useShowFolderView(settings.showFolderView);
	const {
		rootFolder,
		focusedFolder,
		createNewFolder,
		changeExpandedFolderPaths,
		changeFocusedFolder,
		expandedFolderPaths,
		initOrder,
		getNameOfFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			rootFolder: store.rootFolder,
			focusedFolder: store.focusedFolder,
			createNewFolder: store.createNewFolder,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			changeFocusedFolder: store.changeFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			initOrder: store.initFoldersManualSortOrder,
			getNameOfFolder: store.getNameOfFolder,
		}))
	);

	const expandParentFolders = async (folder: TFolder) => {
		const { path } = folder;
		const pathParts = path.split("/");
		const parentPaths = [];
		for (let i = 0; i <= pathParts.length; i++) {
			const pathToExpand = pathParts.slice(0, i).join("/");
			if (pathToExpand) {
				parentPaths.push(pathToExpand);
			}
		}
		const pathsToExpand = uniq([...expandedFolderPaths, ...parentPaths]);
		await changeExpandedFolderPaths(pathsToExpand);
	};

	const onCreateFolder = async () => {
		if (!rootFolder) return;
		const parentFolder = focusedFolder ? focusedFolder : rootFolder;
		const newFolder = await createNewFolder(parentFolder);
		if (newFolder) {
			await expandParentFolders(parentFolder);
			await changeFocusedFolder(newFolder);
		}
		await initOrder();
	};

	const getClassNames = () => {
		return classNames(
			"ffs__action-button-wrapper clickable-icon nav-action-button",
			{
				"ffs__action-button-wrapper--disabled": !showFolderView,
			}
		);
	};

	const getAriaLabel = () => {
		const parentFolder = focusedFolder ? focusedFolder : rootFolder;
		if (!parentFolder) return "";
		const folderName = getNameOfFolder(parentFolder);
		if (language === "zh") {
			return `在 ${folderName} 中创建新文件夹`;
		}
		return `Create a new folder in ${folderName}`;
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
