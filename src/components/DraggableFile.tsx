import { TFile } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";
import FolderFileSplitterPlugin from "src/main";
import useDraggable, { getDraggingStyles } from "src/hooks/useDraggable";
import { FFS_DRAG_FILES_TYPE } from "src/assets/constants";
import { isAbstractFileIncluded } from "src/utils";
import SortableFile from "./SortableFile";

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
const DraggableFile = ({
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
	const { focusedFile, selectFile, setFocusedFile } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
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

	const _isFileSelected = (fi: TFile) =>
		isAbstractFileIncluded(selectedFiles, fi);

	const isFileSelected = () => _isFileSelected(file);

	const beginMultiSelect = (): TFile[] => {
		setFocusedFile(null);
		let newFiles = [...selectedFiles];
		if (focusedFile && !_isFileSelected(focusedFile)) {
			newFiles = [...selectedFiles, focusedFile];
		}
		return newFiles;
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
		isDragging || isAbstractFileIncluded(draggingFiles, file);

	const getFileClassName = () => {
		return [isFileSelected() && "ffs-selected-file"]
			.filter(Boolean)
			.join(" ");
	};

	return (
		<div
			ref={drag}
			onClick={onClickFile}
			className={getFileClassName()}
			style={getDraggingStyles(getIsDragging())}
		>
			<SortableFile
				useFileTreeStore={useFileTreeStore}
				file={file}
				plugin={plugin}
				deleteFile={deleteFile}
				fileList={fileList}
			/>
		</div>
	);
};

export default DraggableFile;
