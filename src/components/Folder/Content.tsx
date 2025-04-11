import { Menu, TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";

import { ExplorerStore } from "src/store";
import { FolderListModal } from "../FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
} from "src/hooks/useSettingsHandler";
import FilesCount from "./FilesCount";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { FOLDER_OPERATION_COPY } from "src/locales";
import { useExplorer } from "src/hooks/useExplorer";
import classNames from "classnames";
import { FolderIcon, StarIcon } from "src/assets/icons";

export type FolderProps = {
	folder: TFolder;
	isOver?: boolean;
};
type Props = FolderProps & {
	onToggleExpandState: () => void;
};
const FolderContent = ({
	folder,
	isOver = false,
	onToggleExpandState,
}: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		focusedFolder,
		setFocusedFolder,
		expandedFolderPaths,
		createNewFolder,
		createFile,
		focusedFile,
		pinFolder,
		unpinFolder,
		isFolderPinned,
		trashFolder,
		renameFolder,
		latestCreatedFolder,
		latestFolderCreatedTime,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolder,
			expandedFolderPaths: store.expandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			focusedFile: store.focusedFile,
			pinFolder: store.pinFolder,
			unpinFolder: store.unpinFolder,
			isFolderPinned: store.isFolderPinned,
			trashFolder: store.trashFolder,
			renameFolder: store.renameFolder,
			latestCreatedFolder: store.latestCreatedFolder,
			latestFolderCreatedTime: store.latestFolderCreatedTime,
		}))
	);

	const { language } = plugin;
	const isFolderExpanded = expandedFolderPaths.includes(folder.path);
	const isRoot = folder.isRoot();

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);
	const isFocused = folder.path == focusedFolder?.path;
	const isFocusedFileInFolder = focusedFile?.parent?.path === folder.path;
	const isFocusedOnFile = isFocused && focusedFile && isFocusedFileInFolder;
	const isFocusedOnFolder = isFocused && !isFocusedOnFile;

	const onSaveName = (name: string) => renameFolder(folder, name);
	const folderName = isRoot ? plugin.app.vault.getName() : folder.name;
	const {
		renderEditableName: renderFolderName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(folderName, onSaveName, {
		isFocused: isFocusedOnFolder,
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

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		menu.addItem((item) => {
			const isPinned = isFolderPinned(folder);
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
			item.setTitle(FOLDER_OPERATION_COPY.createFile[language]);
			item.onClick(async () => {
				if (folder.path !== focusedFolder?.path) {
					await setFocusedFolder(folder);
				}
				await createFile(folder);
			});
		});
		menu.addItem((item) => {
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
			item.setTitle(FOLDER_OPERATION_COPY.moveFolder[language]);
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
			item.setTitle(FOLDER_OPERATION_COPY.renameFolder[language]);
			item.onClick(() => {
				onStartEditingName();
			});
		});
		menu.addItem((item) => {
			item.setTitle(FOLDER_OPERATION_COPY.deleteFolder[language]);
			item.onClick(async () => {
				await trashFolder(folder);
			});
		});
		plugin.app.workspace.trigger("folder-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const onClickFolderName = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (expandFolderByClickingOn !== "folder") return;
		if (focusedFolder?.path !== folder.path) {
			setFocusedFolder(folder);
		} else {
			onToggleExpandState();
		}
	};

	const maybeRenderFolderIcon = () => {
		if (!showFolderIcon) return null;
		const className = classNames("ffs__folder-icon", {
			"ffs__folder-icon--focused": isFocusedOnFolder || isOver,
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
		<div
			ref={folderRef}
			className="ffs__folder-content--main"
			onClick={onClickFolderName}
		>
			{maybeRenderFolderIcon()}
			{renderFolderName()}
			<FilesCount
				folder={folder}
				isFocused={isFocusedOnFolder || isOver}
			/>
		</div>
	);

	return (
		<div
			className={classNames("ffs__folder")}
			onContextMenu={onShowContextMenu}
			onClick={(e) => {
				if (isFocused) {
					e.stopPropagation();
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
