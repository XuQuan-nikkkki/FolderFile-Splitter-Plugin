import { Menu, TFile } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import { moveCursorToEnd, selectText } from "src/utils";
import { FolderListModal } from "./FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	file: TFile;
	plugin: FolderFileSplitterPlugin;
	deleteFile: () => void;
};
const File = ({ file, useFileTreeStore, plugin, deleteFile }: Props) => {
	const {
		focusedFile,
		readFile,
		selectFile,
		createFile,
		duplicateFile,
		folders,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFile: store.focusedFile,
			readFile: store.readFile,
			selectFile: store.selectFile,
			createFile: store.createFile,
			duplicateFile: store.duplicateFile,
			folders: store.folders,
		}))
	);

	const fileNameRef = useRef<HTMLDivElement>(null);
	const [contentPreview, setContentPreview] = useState<string>("");
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(file.basename);
	const { showFileDetail } = useShowFileDetail(
		plugin.settings.showFileDetail
	);

	const loadContent = async () => {
		const content = await readFile(file);
		const cleanContent = content
			.replace(/^---\n[\s\S]*?\n---\n/, "")
			.trim();
		setContentPreview(cleanContent);
	};

	const onSaveNewName = async () => {
		try {
			const newPath = file.path.replace(file.basename, name);
			await plugin.app.vault.rename(file, newPath);
			setIsEditing(false);
		} catch (error) {
			console.error("Save failed：", error);
			alert("Content save failed, please try again!！");
		}
	};

	const onClickOutside = (event: MouseEvent) => {
		if (
			fileNameRef?.current &&
			!fileNameRef.current.contains(event.target)
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
			fileNameRef?.current?.blur();
		} else if (event.key === "Escape") {
			event.preventDefault();
			setIsEditing(false);
			setName(file.basename);
			fileNameRef.current?.blur();
		}
	};

	useEffect(() => {
		if (file.extension !== "md") return;
		loadContent();
	}, []);

	useEffect(() => {
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [isEditing, name]);

	const selectFileNameText = () => {
		const element = fileNameRef.current;
		if (element) {
			selectText(element);
		}
	};

	const onMoveCursorToEnd = () => {
		const element = fileNameRef.current;
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
			item.setTitle("Open in new tab");
			item.onClick(() => {
				plugin.app.workspace.openLinkText(file.path, file.path, true);
				selectFile(file);
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
				const modal = new FolderListModal(plugin, folders, file);
				modal.open();
			});
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Rename");
			item.onClick(() => {
				setIsEditing(true);
				setName(file.basename);
				setTimeout(() => {
					selectFileNameText();
				}, 100);
			});
		});
		menu.addItem((item) => {
			item.setTitle("Delete");
			item.onClick(async () => {
				deleteFile();
				await plugin.app.fileManager.trashFile(file);
			});
		});
		plugin.app.workspace.trigger("file-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const isFocused = focusedFile?.path === file.path;
	const className = "ffs-file" + (isFocused ? " ffs-focused-file" : "");
	const fileNameClassName =
		"ffs-file-name" + (isEditing ? " ffs-file-name-edit-mode" : "");
	return (
		<div
			className={className}
			onClick={() => selectFile(file)}
			onContextMenu={onShowContextMenu}
		>
			<div className="ffs-file-content">
				<div
					className={fileNameClassName}
					ref={fileNameRef}
					contentEditable={isEditing}
					onKeyDown={onKeyDown}
					onInput={onInputNewName}
				>
					{name}
				</div>
				{showFileDetail && (
					<div className="ffs-file-details">
						<span className="ffs-file-created-time">
							{
								new Date(file.stat.ctime)
									.toLocaleString()
									.split(" ")[0]
							}
						</span>
						<span className="ffs-file-content-preview">
							{contentPreview}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default File;
