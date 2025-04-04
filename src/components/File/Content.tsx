import { Menu, TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";

import { ExplorerStore } from "src/store";
import { FolderListModal } from "../FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";
import FileDetail from "./Detail";
import {
	StyledFileContent,
	StyledFileExtension,
	StyledFileContentHeader,
} from "./Styled";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { FILE_OPERATION_COPY } from "src/locales";
import { useExplorer } from "src/hooks/useExplorer";

export type FileProps = {
	file: TFile;
	deleteFile: () => void;
	fileList: TFile[];
};
const FileContent = ({ file, deleteFile, fileList }: FileProps) => {
	const { useExplorerStore, plugin } = useExplorer();

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
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
			createFile: store.createFile,
			duplicateFile: store.duplicateFile,
			isFilePinned: store.isFilePinned,
			pinFile: store.pinFile,
			unpinFile: store.unpinFile,
			trashFile: store.trashFile,
			renameFile: store.renameFile,
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
		className: "ffs__file-name",
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
		const fileCreateTime = file.stat.ctime;
		if (now - fileCreateTime < 3000) {
			onStartEditingName();
		}
	}, []);

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
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.duplicate[language]);
			item.onClick(async () => {
				await duplicateFile(file);
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.moveFile[language]);
			item.onClick(() => {
				const modal = new FolderListModal(
					plugin,
					useExplorerStore,
					file
				);
				modal.open();
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.rename[language]);
			item.onClick(() => {
				onStartEditingName();
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.delete[language]);
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
			<StyledFileContentHeader>
				{renderFileName()}
				<StyledFileExtension $isFocused={isFocused}>
					{file.extension !== "md" && file.extension.toUpperCase()}
				</StyledFileExtension>
			</StyledFileContentHeader>
			{maybeRenderFileDetail()}
		</StyledFileContent>
	);
};

export default FileContent;
