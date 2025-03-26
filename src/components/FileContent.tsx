import { Menu, TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";

import { FILE_MANUAL_SORT_RULE, FileTreeStore } from "src/store";
import { FolderListModal } from "./FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";
import FileDetail from "./FileDetail";
import { useFileTree } from "./FileTree";
import {
	StyledFileContent,
	StyledFileExtension,
	StyledFileNameLine,
} from "./Styled/StyledFile";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { FILE_OPERATION_COPY } from "src/locales";

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
		renameFile,
		initOrder,
		fileSortRule,
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
			renameFile: store.renameFile,
			initOrder: store.initFilesManualSortOrder,
			fileSortRule: store.fileSortRule,
		}))
	);

	const { language } = plugin;
	const { showFileDetail } = useShowFileDetail(
		plugin.settings.showFileDetail
	);

	const isFocused = focusedFile?.path === file.path;
	const onSaveName = (name: string) => renameFile(file, name);

	const {
		renderEditableName: renderFileName,
		selectFileNameText,
		onBeginEdit,
	} = useRenderEditableName(file.basename, onSaveName, {
		isBold: true,
		isFocused,
	});

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

	const maybeInitOrder = async () => {
		if (fileSortRule !== FILE_MANUAL_SORT_RULE) return;
		await initOrder();
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
			const title = isPinned
				? FILE_OPERATION_COPY.unpinFile[language]
				: FILE_OPERATION_COPY.pinFile[language];
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
			item.setTitle(FILE_OPERATION_COPY.openInNewTab[language]);
			item.onClick(() => {
				openFileInNewTab(file);
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.newNote[language]);
			item.onClick(async () => {
				const folder = file.parent || plugin.app.vault.getRoot();
				await createFile(folder);
				await maybeInitOrder();
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.duplicate[language]);
			item.onClick(async () => {
				await duplicateFile(file);
				await maybeInitOrder();
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.moveFile[language]);
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
			item.setTitle(FILE_OPERATION_COPY.rename[language]);
			item.onClick(() => {
				onBeginEdit();
				setTimeout(() => {
					selectFileNameText();
				}, 100);
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.delete[language]);
			item.onClick(async () => {
				deleteFile();
				await trashFile(file);
				await maybeInitOrder();
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
