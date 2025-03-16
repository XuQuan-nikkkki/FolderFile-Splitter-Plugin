import { Menu, TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { FILE_MANUAL_SORT_RULE, FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";
import FileDetail from "./FileDetail";
import useRenderFileName from "src/hooks/useRenderFileName";
import { useFileTree } from "./FileTree";
import { useEffect, useRef, useState } from "react";
import {
	StyledFileContent,
	StyledFileExtension,
	StyledFileNameLine,
} from "./Styled/StyledFile";

export type FileProps = {
	file: TFile;
	deleteFile: () => void;
	fileList: TFile[];
};
const FileContent = ({ file, deleteFile, fileList }: FileProps) => {
	const { useFileTreeStore, plugin } = useFileTree();

	const {
		focusedFile,
		selectFile,
		createFile,
		duplicateFile,
		isFilePinned,
		pinFile,
		unpinFile,
		trashFile,
		fileSortRule,
		order,
		_updateAndSaveFilesOrder,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
			createFile: store.createFile,
			duplicateFile: store.duplicateFile,
			isFilePinned: store.isFilePinned,
			pinFile: store.pinFile,
			unpinFile: store.unpinFile,
			trashFile: store.trashFile,
			fileSortRule: store.fileSortRule,
			order: store.filesManualSortOrder,
			_updateAndSaveFilesOrder: store._updateAndSaveFilesOrder,
		}))
	);

	const { showFileDetail } = useShowFileDetail(
		plugin.settings.showFileDetail
	);

	const beforeSaveName = async (newPath: string) => {
		if (fileSortRule !== FILE_MANUAL_SORT_RULE) return;
		const parentPath = file.parent?.path;
		if (!parentPath) return;
		const paths = order[parentPath] ?? [];
		const index = paths.indexOf(file.path);
		if (index >= 0) {
			paths[index] = newPath;
		} else {
			paths.push(newPath);
		}
		_updateAndSaveFilesOrder({
			...order,
			[parentPath]: paths,
		});
	};

	const isFocused = focusedFile?.path === file.path;
	const { renderFileName, selectFileNameText, onBeginEdit } =
		useRenderFileName(file, plugin, beforeSaveName, { isFocused });
	const fileRef = useRef<HTMLDivElement>(null);
	const [isFocusing, setIsFocusing] = useState<boolean>(false);

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter" && isFocusing) {
			onBeginEdit();
			setTimeout(() => {
				selectFileNameText();
			}, 100);
		}
	};

	const onClickOutside = (event: MouseEvent) => {
		if (
			fileRef.current &&
			!fileRef.current.contains(event.target as Node)
		) {
			setIsFocusing(false);
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [isFocusing]);

	const onShowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const menu = new Menu();
		menu.addItem((item) => {
			const isPinned = isFilePinned(file);
			const title = isPinned ? "Unpin file" : "Pin file";
			item.setTitle(title);
			item.onClick(() => {
				if (isPinned) {
					unpinFile(file);
				} else {
					pinFile(file);
				}
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Open in new tab");
			item.onClick(() => {
				openFileInNewTab(file);
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("New note");
			item.onClick(() => {
				const folder = file.parent || plugin.app.vault.getRoot();
				createFile(folder);
			});
		});
		menu.addItem((item) => {
			item.setTitle("Duplicate");
			item.onClick(() => {
				duplicateFile(file);
			});
		});
		menu.addItem((item) => {
			item.setTitle("Move file to...");
			item.onClick(() => {
				const modal = new FolderListModal(
					plugin,
					useFileTreeStore,
					file
				);
				modal.open();
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Rename");
			item.onClick(() => {
				onBeginEdit();
				setTimeout(() => {
					selectFileNameText();
				}, 100);
			});
		});
		menu.addItem((item) => {
			item.setTitle("Delete");
			item.onClick(async () => {
				deleteFile();
				await trashFile(file);
			});
		});
		plugin.app.workspace.trigger("file-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const openFileInNewTab = (file: TFile) => {
		plugin.app.workspace.openLinkText(file.path, file.path, true);
		selectFile(file);
	};

	const maybeRenderFileDetail = () => {
		if (!showFileDetail) return null;
		return <FileDetail file={file} isFocused={isFocused} />;
	};

	const isLast = [...fileList].reverse()[0]?.path === file.path;
	return (
		<StyledFileContent
			ref={fileRef}
			onContextMenu={onShowContextMenu}
			onClick={(e) => {
				if (e.ctrlKey || e.metaKey) {
					openFileInNewTab(file);
				} else if (isFocused) {
					e.stopPropagation();
					fileRef.current?.focus();
					setIsFocusing(true);
				}
			}}
			$isFocused={isFocused}
			$isLast={isLast}
			$disableGap={!showFileDetail}
		>
			<StyledFileNameLine>
				{renderFileName()}
				<StyledFileExtension $isFocused={isFocused}>
					{file.extension !== "md" && file.extension.toUpperCase()}
				</StyledFileExtension>
			</StyledFileNameLine>
			{maybeRenderFileDetail()}
		</StyledFileContent>
	);
};

export default FileContent;
