import { Menu, TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { ExplorerStore } from "src/store";
import { FolderListModal } from "../FolderListModal";
import {
	useFileItemSpacing,
	useShowFileDetail,
	useShowFileItemDivider,
} from "src/hooks/useSettingsHandler";
import FileDetail from "./Detail";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { FILE_OPERATION_COPY } from "src/locales";
import { useExplorer } from "src/hooks/useExplorer";

export type FileProps = {
	file: TFile;
	deleteFile: () => void;
};
const FileContent = ({ file, deleteFile }: FileProps) => {
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

	const { language, settings } = plugin;
	const { showFileDetail } = useShowFileDetail(settings.showFileDetail);
	const { fileItemSpacing } = useFileItemSpacing(settings.fileItemSpacing);
	const { showFileItemDivider } = useShowFileItemDivider(
		settings.showFileItemDivider
	);

	const isFocused = focusedFile?.path === file.path;
	const onSaveName = (name: string) => renameFile(file, name);

	const {
		renderEditableName: renderFileName,
		selectFileNameText,
		onBeginEdit,
		isEditing,
	} = useRenderEditableName(file.basename, onSaveName, {
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
			item.setIcon(isPinned ? "pin-off" : "pin");
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
			item.setIcon("file-plus");
			item.setTitle(FILE_OPERATION_COPY.openInNewTab[language]);
			item.onClick(() => {
				openFileInNewTab(file);
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setIcon("square-pen");
			item.setTitle(FILE_OPERATION_COPY.newNote[language]);
			item.onClick(async () => {
				const folder = file.parent || plugin.app.vault.getRoot();
				await createFile(folder);
			});
		});
		menu.addItem((item) => {
			item.setTitle(FILE_OPERATION_COPY.duplicate[language]);
			item.setIcon("copy");
			item.onClick(async () => {
				await duplicateFile(file);
			});
		});
		menu.addItem((item) => {
			item.setIcon("folder-tree");
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
			item.setIcon("pencil-line");
			item.setTitle(FILE_OPERATION_COPY.rename[language]);
			item.onClick(() => {
				onStartEditingName();
			});
		});
		menu.addItem((item) => {
			const fragment = document.createDocumentFragment();
			const title = document.createElement("span");
			title.style.color = "#D04255";
			title.textContent = FILE_OPERATION_COPY.delete[language];
			fragment.append(title);
			item.setTitle(fragment);

			item.setIcon("trash-2");
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
		return <FileDetail file={file} />;
	};

	return (
		<div
			className={classNames(
				"ffs__file-content tree-item-self nav-file-title tappable is-clickable",
				{
					"is-active": isFocused,
					"has-focus is-being-renamed": isEditing,
					"ffs__file-content--divider": showFileItemDivider,
				}
			)}
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
		>
			<div
				className={classNames(
					"ffs__file-content-header tree-item-inner nav-file-title-content",
					{
						"ffs__file-content-header--comfortable":
							fileItemSpacing === "Comfortable",
						"ffs__file-content-header--with-detail": showFileDetail,
					}
				)}
			>
				<div className="ffs__file-content-title">
					{renderFileName()}
					<div className="nav-file-tag">
						{file.extension !== "md" &&
							file.extension.toUpperCase()}
					</div>
				</div>
				{maybeRenderFileDetail()}
			</div>
		</div>
	);
};

export default FileContent;
