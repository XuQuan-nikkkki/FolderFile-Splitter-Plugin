import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

import { FolderIcon, TagIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { ViewMode } from "src/store/common";

const ViewModeDisplay = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;
	const isZh = language === "zh";

	const { viewMode, focusedFolder, focusedTag, getNameOfFolder } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				viewMode: store.viewMode,
				focusedFolder: store.focusedFolder,
				focusedTag: store.focusedTag,
				getNameOfFolder: store.getNameOfFolder,
			}))
		);

	const labelMap: Record<ViewMode, string> = {
		folder: isZh ? "文件夹：" : "Folder: ",
		tag: isZh ? "标签：" : "Tag: ",
		all: isZh ? "全部文件" : "All Files",
	};
	const iconClassName = "ffs__view-mode-icon";
	const iconMap: Record<ViewMode, ReactNode> = {
		folder: <FolderIcon className={iconClassName} />,
		tag: <TagIcon className={iconClassName} />,
		all: <FolderIcon className={iconClassName} />,
	};

	const getFolderPath = () => {
		if (!focusedFolder) return "";
		if (focusedFolder.isRoot()) return "/" + getNameOfFolder(focusedFolder);
		return "/" + focusedFolder.path;
	};

	const renderPathContent = (path: string, fullPath: string) => (
		<span
			className="ffs__view-mode--path"
			aria-label={fullPath}
			data-tooltip-position="bottom"
		>
			{path}
		</span>
	);

	const renderPath = () => {
		if (viewMode === "folder") {
			if (!focusedFolder) return "";
			const name = getNameOfFolder(focusedFolder);
			const path = getFolderPath();
			return renderPathContent(name, path);
		} else if (viewMode === "tag") {
			if (!focusedTag) return "";
			return renderPathContent(focusedTag.name, focusedTag.fullPath);
		}
	};

	return (
		<div className="ffs__view-mode">
			<div className="ffs__view-mode--main">
				{iconMap[viewMode]} {labelMap[viewMode]}
				{renderPath()}
			</div>
		</div>
	);
};

export default ViewModeDisplay;
