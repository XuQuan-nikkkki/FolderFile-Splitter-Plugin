import { Menu, TFile } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import { FolderListModal } from "./FolderListModal";
import { useShowFileDetail } from "src/hooks/useSettingsHandler";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import FileDetail from "./FileDetail";
import useDraggable, { getDraggingStyles } from "src/hooks/useDraggable";
import { FFS_DRAG_FILES_TYPE } from "src/assets/constants";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	file: TFile;
	fileList: TFile[];
	plugin: FolderFileSplitterPlugin;
	deleteFile: () => void;
	selectedFiles: TFile[];
	draggingFiles: TFile[];
	setSelectedFiles: (files: TFile[]) => void;
	setDraggingFiles: (files: TFile[]) => void;
};
const File = ({
	file,
	fileList,
	useFileTreeStore,
	plugin,
	deleteFile,
	selectedFiles,
	setSelectedFiles,
	draggingFiles,
	setDraggingFiles,
}: Props) => {
	const {
		focusedFile,
		selectFile,
		createFile,
		duplicateFile,
		folders,
		setFocusedFile,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
			createFile: store.createFile,
			duplicateFile: store.duplicateFile,
			folders: store.folders,
			setFocusedFile: store.setFocusedFile,
		}))
	);

	const { drag, isDragging } = useDraggable({
		type: FFS_DRAG_FILES_TYPE,
		item: () => {
			const filesToDrag = isFileSelected() ? selectedFiles : [file];
			setDraggingFiles(filesToDrag);
			return { files: filesToDrag };
		},
		end: () => {
			setDraggingFiles([]);
		},
		deps: [selectedFiles, draggingFiles],
	});

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
		return <FileDetail useFileTreeStore={useFileTreeStore} file={file} />;
	};

	const _isFileIncluded = (files: TFile[], fi: TFile) =>
		files.some((f) => f.path === fi.path);

	const _isFileSelected = (fi: TFile) => _isFileIncluded(selectedFiles, fi);

	const isFileSelected = () => _isFileSelected(file);

	const beginMultiSelect = (): TFile[] => {
		setFocusedFile(null);
		let newFiles = [...selectedFiles]
		if (focusedFile && !_isFileSelected(focusedFile)) {
			newFiles = [...selectedFiles, focusedFile];
		}
		return newFiles
	};

	const onSelectRange = () => {
		const files = beginMultiSelect();
		if (!files.length) return;
		const lastSelectedFile = files[files.length - 1];
		const lastIndex = fileList.findIndex(
			(f) => f.path === lastSelectedFile?.path
		);
		const currentIndex = fileList.findIndex((f) => f.path === file.path);

		const [start, end] =
			lastIndex < currentIndex
				? [lastIndex, currentIndex]
				: [currentIndex, lastIndex];

		const newFiles = fileList.slice(start, end + 1);
		setSelectedFiles(newFiles);
	};

	const onSelectOneByOne = () => {
		let files = beginMultiSelect();
		if (isFileSelected()) {
			files = files.filter((f) => f.path !== file.path);
		} else {
			files.push(file);
		}
		setSelectedFiles(files);
	};

	const onClickFile = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.shiftKey && (selectedFiles.length > 1 || focusedFile)) {
			onSelectRange();
		} else if (e.altKey || e.metaKey) {
			onSelectOneByOne();
		} else {
			setSelectedFiles([file]);
			selectFile(file);
		}
	};

	const getIsDragging = () =>
		isDragging || draggingFiles.some((f) => f.path === file.path);

	const getFileClassName = () => {
		const isFocused = focusedFile?.path === file.path;
		return [
			"ffs-file",
			isFocused && "ffs-focused-file",
			isFileSelected() && "ffs-selected-file",
		]
			.filter(Boolean)
			.join(" ");
	};

	return (
		<div
			ref={drag}
			className={getFileClassName()}
			onClick={onClickFile}
			onContextMenu={onShowContextMenu}
			style={getDraggingStyles(getIsDragging())}
		>
			<div className="ffs-file-content">
				{renderEditableName()}
				{maybeRenderFileDetail()}
			</div>
		</div>
	);
};

export default File;
