import { Menu, TFile } from "obsidian";
import { useEffect, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import { FolderListModal } from "./FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";
import useRenderEditableName from "src/hooks/useRenderEditableName";

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

	const [contentPreview, setContentPreview] = useState<string>("");
	const { showFileDetail } = useShowFileDetail(
		plugin.settings.showFileDetail
	);

	const onSaveName = async (name: string) => {
		const newPath = file.path.replace(file.basename, name);
		await plugin.app.vault.rename(file, newPath);
	};

	const getClassNames = (isEditing: boolean) => {
		return "ffs-file-name" + (isEditing ? " ffs-file-name-edit-mode" : "");
	};

	const { renderEditableName, selectFileNameText, onBeginEdit } =
		useRenderEditableName(file.basename, onSaveName, getClassNames);

	const maybeLoadContent = async () => {
		if (file.extension !== "md") return;
		const content = await readFile(file);
		const cleanContent = content
			.replace(/^---\n[\s\S]*?\n---\n/, "")
			.trim();
		setContentPreview(cleanContent);
	};

	useEffect(() => {
		maybeLoadContent();
	}, []);

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
				await plugin.app.fileManager.trashFile(file);
			});
		});
		plugin.app.workspace.trigger("file-context-menu", menu);
		menu.showAtPosition({ x: e.clientX, y: e.clientY });
	};

	const maybeRenderFileDetail = () => {
		if (!showFileDetail) return null;

		const fileCreatedDate = new Date(file.stat.ctime)
			.toLocaleString()
			.split(" ")[0];
		return (
			<div className="ffs-file-details">
				<span className="ffs-file-created-time">{fileCreatedDate}</span>
				<span className="ffs-file-content-preview">
					{contentPreview}
				</span>
			</div>
		);
	};

	const getFileClassName = () => {
		const isFocused = focusedFile?.path === file.path;
		return "ffs-file" + (isFocused ? " ffs-focused-file" : "");
	};

	return (
		<div
			className={getFileClassName()}
			onClick={() => selectFile(file)}
			onContextMenu={onShowContextMenu}
		>
			<div className="ffs-file-content">
				{renderEditableName()}
				{maybeRenderFileDetail()}
			</div>
		</div>
	);
};

export default File;
