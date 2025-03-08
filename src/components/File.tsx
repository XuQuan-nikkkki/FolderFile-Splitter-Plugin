import { Menu, TFile } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import { FolderListModal } from "./FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";
import FileDetail from "./FileDetail";
import useRenderFileName from "src/hooks/useRenderFileName";

const File = styled.div<{
	$isFocused: boolean;
	$isLast: boolean;
	$isSelected: boolean;
}>`
	display: grid;
	grid-template-rows: auto auto;
	gap: 4px;
	border-radius: var(--ffs-border-radius);
	padding: 12px 16px 14px;
	background-color: ${({ $isFocused, $isSelected }) =>
		$isFocused || $isSelected
			? "var(--interactive-accent)"
			: undefined} !important;

	&:hover {
		background-color: var(--interactive-hover);
	}

	${({ $isFocused, $isLast, $isSelected }) =>
		!$isFocused &&
		!$isLast &&
		!$isSelected &&
		`
    &:not(:hover)::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 14px;
      right: 12px;
      height: var(--border-width);
      background-color: var(--interactive-hover);
    }
  `}
`;

export type FileProps = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	file: TFile;
	plugin: FolderFileSplitterPlugin;
	deleteFile: () => void;
	fileList: TFile[];
	isSelected: boolean;
};
const FileComponent = ({
	file,
	useFileTreeStore,
	plugin,
	deleteFile,
	fileList,
	isSelected,
}: FileProps) => {
	const {
		focusedFile,
		selectFile,
		createFile,
		duplicateFile,
		folders,
		isFilePinned,
		pinFile,
		unpinFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
			createFile: store.createFile,
			duplicateFile: store.duplicateFile,
			folders: store.folders,
			isFilePinned: store.isFilePinned,
			pinFile: store.pinFile,
			unpinFile: store.unpinFile,
		}))
	);

	const { showFileDetail } = useShowFileDetail(
		plugin.settings.showFileDetail
	);

	const isFocused = focusedFile?.path === file.path;
	const { renderFileName, selectFileNameText, onBeginEdit } =
		useRenderFileName(file, plugin, isFocused || isSelected);

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
		return (
			<FileDetail
				useFileTreeStore={useFileTreeStore}
				file={file}
				isFocused={isFocused || isSelected}
			/>
		);
	};

	const isLast = [...fileList].reverse()[0].path === file.path;
	return (
		<File
			onContextMenu={onShowContextMenu}
			$isFocused={isFocused}
			$isLast={isLast}
			$isSelected={isSelected}
		>
			{renderFileName()}
			{maybeRenderFileDetail()}
		</File>
	);
};

export default FileComponent;
