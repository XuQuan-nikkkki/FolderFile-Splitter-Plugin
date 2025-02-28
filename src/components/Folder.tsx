import { Menu, TFolder } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { ArrowDownIcon, ArrowRightIcon, FolderIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { moveCursorToEnd, selectText } from "src/utils";
import { FolderListModal } from "./FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
	useIncludeSubfolderFilesCount,
} from "src/hooks/useSettingsHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	folder: TFolder;
	isRoot?: boolean;
};
const Folder = ({
	folder,
	useFileTreeStore,
	plugin,
	isRoot = false,
}: Props) => {
	const {
		getFilesCountInFolder,
		hasFolderChildren,
		focusedFolder,
		setFocusedFolder,
		expandedFolderPaths,
		changeExpandedFolderPaths,
		createNewFolder,
		createFile,
		folders,
		focusedFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			getFilesCountInFolder: store.getFilesCountInFolder,
			hasFolderChildren: store.hasFolderChildren,
			focusedFolder: store.focusedFolder,
			setFocusedFolder: store.setFocusedFolderAndSaveInLocalStorage,
			expandedFolderPaths: store.expandedFolderPaths,
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			createNewFolder: store.createNewFolder,
			createFile: store.createFile,
			folders: store.folders,
			focusedFile: store.focusedFile,
		}))
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);
	const folderName = isRoot ? plugin.app.vault.getName() : folder.name;
	const folderNameRef = useRef<HTMLDivElement>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(folderName);

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);
	const { includeSubfolderFilesCount } = useIncludeSubfolderFilesCount(
		settings.includeSubfolderFilesCount
	);

	const onToggleExpandState = (): void => {
		if (isRoot) return;
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: [...expandedFolderPaths, folder.path];
			changeExpandedFolderPaths(folderPaths);
		}
	};

	const onSaveNewName = async () => {
		try {
			const newPath = folder.path.replace(folder.name, name);
			await plugin.app.vault.rename(folder, newPath);
			setIsEditing(false);
		} catch (error) {
			console.error("保存失败：", error);
			alert("内容保存失败，请重试！");
		}
	};

	const onClickOutside = (event: MouseEvent) => {
		if (
			folderNameRef?.current &&
			!folderNameRef.current.contains(event.target)
		) {
			if (isEditing) {
				onSaveNewName();
			}
		}
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		if (event.key === "Enter") {
			event.preventDefault();
			onSaveNewName();
			folderNameRef?.current?.blur();
		} else if (event.key === "Escape") {
			event.preventDefault();
			setIsEditing(false);
			setName(folderName);
			folderNameRef.current?.blur();
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", onClickOutside);
		return () => {
			document.removeEventListener("mousedown", onClickOutside);
		};
	}, [isEditing, name]);

	const selectFolderNameText = () => {
		const element = folderNameRef.current;
		if (element) {
			selectText(element);
		}
	};

	const onMoveCursorToEnd = () => {
		const element = folderNameRef.current;
		if (element) {
			moveCursorToEnd(element);
		}
	};

	const onInputNewName = (e: React.FormEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		setName(target.textContent || "");
		onMoveCursorToEnd();
	};

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		menu.addItem((item) => {
			item.setTitle("New note");
			item.onClick(() => {
				createFile(folder);
			});
		});
		menu.addItem((item) => {
			item.setTitle("New folder");
			item.onClick(() => {
				createNewFolder(folder);
				if (!isFolderExpanded) {
					onToggleExpandState();
				}
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Move folder to...");
			item.onClick(() => {
				const modal = new FolderListModal(plugin, folders, folder);
				modal.open();
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Rename folder");
			item.onClick(() => {
				setIsEditing(true);
				setName(folderName);
				setTimeout(() => {
					selectFolderNameText();
				}, 100);
			});
		});
		menu.addItem((item) => {
			item.setTitle("Delete");
			item.onClick(() => {
				plugin.app.fileManager.trashFile(folder);
			});
		});
		plugin.app.workspace.trigger("folder-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const renderFilesCount = () => {
		const filesCount = getFilesCountInFolder(
			folder,
			includeSubfolderFilesCount
		);
		return <span className="ffs-files-count">{filesCount}</span>;
	};

	const isFocused = folder.path == focusedFolder?.path;
	const isExpanded = isRoot || expandedFolderPaths.includes(folder.path);

	const folderClassNames = ["ffs-folder"];
	if (
		isFocused &&
		(!focusedFile || focusedFile.parent?.path !== folder.path)
	) {
		folderClassNames.push("ffs-focused-folder");
	} else if (isFocused) {
		folderClassNames.push("ffs-focused-folder-with-focused-file");
	}
	if (isRoot) {
		folderClassNames.push("ffs-root-folder");
	}

	const folderNameClassName =
		"ffs-folder-name" + (isEditing ? " ffs-folder-name-edit-mode" : "");
	return (
		<div
			className={folderClassNames.join(" ")}
			onClick={() => setFocusedFolder(folder)}
			onContextMenu={onShowContextMenu}
		>
			<div
				className="ffs-folder-pane-left-sectionn"
				onClick={(e) => {
					if (expandFolderByClickingOn == "folder") {
						e.stopPropagation();
						if (focusedFolder?.path !== folder.path) {
							setFocusedFolder(folder);
						} else {
							onToggleExpandState();
						}
					}
				}}
			>
				<span
					className="ffs-folder-arrow-icon-wrapper"
					onClick={(e) => {
						if (expandFolderByClickingOn == "icon") {
							e.stopPropagation();
							onToggleExpandState();
						}
					}}
				>
					{hasFolderChildren(folder) &&
						!isRoot &&
						(isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />)}
				</span>
				{showFolderIcon && <FolderIcon />}
				<div
					ref={folderNameRef}
					className={folderNameClassName}
					contentEditable={isEditing}
					onKeyDown={onKeyDown}
					onInput={onInputNewName}
				>
					{name}
				</div>
			</div>
			{renderFilesCount()}
		</div>
	);
};

export default Folder;
