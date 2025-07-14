import classNames from "classnames";
import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

import { FolderIcon, TagIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { VIEW_MODE, ViewMode } from "src/store/common";

import Search from "../Search";

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

	const renderViewModeTipsHeader = () => {
		const iconClassName = "ffs__view-mode-icon";
		const iconMap: Record<ViewMode, ReactNode> = {
			folder: <FolderIcon className={iconClassName} />,
			tag: <TagIcon className={iconClassName} />,
			all: <FolderIcon className={iconClassName} />,
		};
		const labelMap: Record<ViewMode, string> = {
			folder: isZh ? "文件夹：" : "Folder: ",
			tag: isZh ? "标签：" : "Tag: ",
			all: isZh ? "全部文件" : "All Files",
		};
		return (
			<>
				{iconMap[viewMode]} {labelMap[viewMode]}
			</>
		);
	};

	const maybeRenderPath = () => {
		if (viewMode === VIEW_MODE.FOLDER) {
			if (!focusedFolder) return "";
			const name = getNameOfFolder(focusedFolder);
			const path = getFolderPath();
			return renderPathContent(name, path);
		}

		if (viewMode === VIEW_MODE.TAG) {
			if (!focusedTag) return "";
			return renderPathContent(focusedTag.fullPath, focusedTag.fullPath);
		}
	};

	const maybeRenderViewModeTips = () => (
		<div className="ffs__view-mode--main">
			{renderViewModeTipsHeader()}
			{maybeRenderPath()}
		</div>
	);

	const maybeRenderSearch = () => {
		if (viewMode !== VIEW_MODE.SEARCH) return null;
		return <Search />;
	};

	return (
		<div
			className={classNames("ffs__view-mode", {
				"ffs__view-mode--search": viewMode === VIEW_MODE.SEARCH,
			})}
		>
			{maybeRenderViewModeTips()}
			{maybeRenderSearch()}
		</div>
	);
};

export default ViewModeDisplay;
