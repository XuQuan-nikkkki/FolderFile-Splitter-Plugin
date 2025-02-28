import { Menu, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { ArrowDownIcon, ArrowRightIcon, FolderIcon } from "src/assets/icons";
import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import {
	useShowFolderIcon,
	useExpandFolderByClickingOnElement,
	useIncludeSubfolderFilesCount,
} from "src/hooks/useSettingsHandler";
import useRenderEditableName from "src/hooks/useRenderEditableName";

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

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);
	const { expandFolderByClickingOn } = useExpandFolderByClickingOnElement(
		settings.expandFolderByClickingOn
	);
	const { includeSubfolderFilesCount } = useIncludeSubfolderFilesCount(
		settings.includeSubfolderFilesCount
	);

	const getFolderNameClassNames = (isEditing: boolean): string => {
		return (
			"ffs-folder-name" + (isEditing ? " ffs-folder-name-edit-mode" : "")
		);
	};

	const onSaveName = async (name: string) => {
		const newPath = folder.path.replace(folder.name, name);
		await plugin.app.vault.rename(folder, newPath);
	};

	const { renderEditableName, selectFileNameText, onBeginEdit } =
		useRenderEditableName(folderName, onSaveName, getFolderNameClassNames);

	const onToggleExpandState = (): void => {
		if (isRoot) return;
		if (hasFolderChildren(folder)) {
			const folderPaths = isFolderExpanded
				? expandedFolderPaths.filter((path) => path !== folder.path)
				: [...expandedFolderPaths, folder.path];
			changeExpandedFolderPaths(folderPaths);
		}
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
				onBeginEdit();
				setTimeout(() => {
					selectFileNameText();
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
				{renderEditableName()}
			</div>
			{renderFilesCount()}
		</div>
	);
};

export default Folder;
