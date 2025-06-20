import { Menu, TFile } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { ExplorerStore } from "src/store";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { useExplorer } from "src/hooks/useExplorer";
import { FILE_OPERATION_COPY } from "src/locales";
import {
	useBoldFileTitle,
	useFileItemSpacing,
	useShowFileDetail,
	useShowFileItemDivider,
} from "src/hooks/useSettingsHandler";
import { FolderListModal } from "../FolderListModal";
import FileDetail from "./Detail";

export type FileProps = {
	file: TFile;
};
const FileContent = ({ file }: FileProps) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language, settings } = plugin;

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

	const {
		showFileDetail: showDetail,
		fileItemSpacing: spacing,
		showFileItemDivider: showDivider,
		boldFileTitle: boldTitle,
	} = settings;
	const { showFileDetail } = useShowFileDetail(showDetail);
	const { fileItemSpacing } = useFileItemSpacing(spacing);
	const { showFileItemDivider } = useShowFileItemDivider(showDivider);
	const { boldFileTitle } = useBoldFileTitle(boldTitle);

	const onSaveName = (name: string) => renameFile(file, name);

	const {
		renderEditableName: renderFileName,
		selectFileNameText,
		onBeginEdit,
		isEditing,
	} = useRenderEditableName(file.basename, onSaveName, {
		className: "ffs__file-name",
		bold: boldFileTitle,
	});

	const isFocused = focusedFile?.path === file.path;
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

	useEffect(() => {
		if (focusedFile?.path !== file.path) return;
		setTimeout(() => {
			fileRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 100);
	}, [focusedFile]);

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
				// deleteFile();
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

	const getClassNames = () => {
		return classNames(
			"ffs__file-content tree-item-self nav-file-title tappable is-clickable",
			{
				"is-active": isFocused,
				"has-focus is-being-renamed": isEditing,
				"ffs__file-content--divider": showFileItemDivider,
			}
		);
	};

	const getHeaderClassNames = () => {
		return classNames(
			"ffs__file-content-header tree-item-inner nav-file-title-content",
			{
				"ffs__file-content-header--comfortable":
					fileItemSpacing === "Comfortable",
				"ffs__file-content-header--with-detail": showFileDetail,
			}
		);
	};

	const onClickFile = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.ctrlKey || e.metaKey) {
			openFileInNewTab(file);
		} else if (isFocused) {
			e.stopPropagation();
			fileRef.current?.focus();
			setIsFocusing(true);
		}
	};

	return (
		<div
			className={getClassNames()}
			ref={fileRef}
			onContextMenu={onShowContextMenu}
			onClick={onClickFile}
		>
			<div className={getHeaderClassNames()}>
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
