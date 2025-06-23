import classNames from "classnames";
import { Menu, TFolder } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { FolderIcon, StarIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { useShowFolderIcon } from "src/hooks/useSettingsHandler";
import { FOLDER_OPERATION_COPY } from "src/locales";
import { ExplorerStore } from "src/store";


import { FolderListModal } from "../FolderListModal";


import FilesCount from "./FilesCount";


export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps & {
	onToggleExpandState: () => void;
};
const FolderContent = ({ folder, onToggleExpandState }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		focusedFolder,
		setFocusedFolder,
		expandedFolderPaths,
		createNewFolder,
		createFile,
		pinFolder,
		unpinFolder,
		isFolderPinned,
		trashFolder,
		renameFolder,
		latestCreatedFolder,
		latestFolderCreatedTime,
		getNameOfFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
			trashFolder: store.trashFolder,
			renameFolder: store.renameFolder,
			latestCreatedFolder: store.latestCreatedFolder,
			latestFolderCreatedTime: store.latestFolderCreatedTime,
			getNameOfFolder: store.getNameOfFolder,
		}))
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);
	const isRoot = folder.isRoot();

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);

	const isFocused = folder.path == focusedFolder?.path;

	const onSaveName = (name: string) => renameFolder(folder, name);
	const folderName = getNameOfFolder(folder);
	const {
		renderEditableName: renderFolderName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(folderName, onSaveName, {
		className: "ffs__folder-name",
	});

	const folderRef = useRef<HTMLDivElement>(null);
	const [isFocusing, setIsFocusing] = useState<boolean>(false);

	const onClickOutside = (event: MouseEvent) => {
		if (
			folderRef.current &&
			!folderRef.current.contains(event.target as Node)
		) {
			setIsFocusing(false);
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && isFocusing) {
			onBeginEdit();
			setTimeout(() => {
				selectFileNameText();
			}, 100);
		}
	};

	const onStartEditingName = () => {
		onBeginEdit();
		setTimeout(() => {
			selectFileNameText();
		}, 100);
	};

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [isFocusing]);

	useEffect(() => {
		const now = Date.now();
		if (
			folder.path === latestCreatedFolder?.path &&
			latestFolderCreatedTime &&
			now - latestFolderCreatedTime < 3000
		) {
			onStartEditingName();
		}
	}, []);

	useEffect(() => {
		if (focusedFolder?.path !== folder.path) return;
		setTimeout(() => {
			folderRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 100);
	}, [focusedFolder]);

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		menu.addItem((item) => {
			const isPinned = isFolderPinned(folder);
			item.setIcon(isPinned ? "pin-off" : "pin");
			const title = isPinned
				? FOLDER_OPERATION_COPY.unpinFolder[language]
				: FOLDER_OPERATION_COPY.pinFolder[language];
			item.setTitle(title);
			item.onClick(() => {
				if (isPinned) {
					unpinFolder(folder);
				} else {
					pinFolder(folder);
				}
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setIcon("square-pen");
			item.setTitle(FOLDER_OPERATION_COPY.createFile[language]);
			item.onClick(async () => {
				if (folder.path !== focusedFolder?.path) {
					await setFocusedFolder(folder);
				}
				await createFile(folder);
			});
		});
		menu.addItem((item) => {
			item.setIcon("folder-open");
			item.setTitle(FOLDER_OPERATION_COPY.createFolder[language]);
			item.onClick(async () => {
				const newFolder = await createNewFolder(folder);
				if (!isFolderExpanded) {
					onToggleExpandState();
				}
				if (newFolder) {
					await setFocusedFolder(newFolder);
				}
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setIcon("folder-tree");
			item.setTitle(FOLDER_OPERATION_COPY.moveFolder[language]);
			item.setDisabled(folder.isRoot());
			item.onClick(() => {
				const modal = new FolderListModal(
					plugin,
					useExplorerStore,
					folder
				);
				modal.open();
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setIcon("pencil-line");
			item.setTitle(FOLDER_OPERATION_COPY.renameFolder[language]);
			item.setDisabled(folder.isRoot());
			item.onClick(() => {
				onStartEditingName();
			});
		});
		menu.addItem((item) => {
			const fragment = document.createDocumentFragment();
			const title = document.createElement("span");
			title.style.color = "#D04255";
			title.textContent = FOLDER_OPERATION_COPY.deleteFolder[language];
			fragment.append(title);
			item.setTitle(fragment);

			item.setIcon("trash-2");
			item.setDisabled(folder.isRoot());
			item.onClick(async () => {
				await trashFolder(folder);
			});
		});
		plugin.app.workspace.trigger("folder-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const maybeRenderFolderIcon = () => {
		if (!showFolderIcon) return null;
		const className = classNames("ffs__folder-icon", {
			"ffs__folder-icon--root": isRoot,
		});

		return (
			<div className="ffs__folder-icon-wrapper">
				{isRoot ? (
					<StarIcon className={className} />
				) : (
					<FolderIcon className={className} />
				)}
			</div>
		);
	};

	const renderTitleContent = () => (
		<div ref={folderRef} className="ffs__folder-content--main">
			{maybeRenderFolderIcon()}
			{renderFolderName()}
			<FilesCount folder={folder} />
		</div>
	);

	return (
		<div
			className={classNames("ffs__folder")}
			onContextMenu={onShowContextMenu}
			onClick={(e) => {
				if (isFocused) {
					folderRef.current?.focus();
					setIsFocusing(true);
				}
			}}
		>
			{renderTitleContent()}
		</div>
	);
};

export default FolderContent;
