import { useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { FFS_DRAG_FILE } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";

import FileContent, { FileProps } from "./Content";

type Props = FileProps & {
	onOpenFoldersPane: () => void;
	disableDrag?: boolean;
};
const File = ({
	file,
	fileList,
	deleteFile,
	disableDrag,
	onOpenFoldersPane,
}: Props) => {
	const { useExplorerStore } = useExplorer();

	const { selectFile } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			selectFile: store.selectFile,
		}))
	);

	const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
		id: file.path,
		data: { type: FFS_DRAG_FILE, item: file },
		disabled: disableDrag,
	});

	useEffect(() => {
		window.addEventListener("dblclick", onOpenFoldersPane);
		return () => {
			window.removeEventListener("dblclick", onOpenFoldersPane);
		};
	}, [onOpenFoldersPane]);

	return (
		<div
			className="ffs__file-tree-item tree-item nav-file"
			ref={setNodeRef}
			style={{ opacity: isDragging ? 0 : 1 }}
			onClick={() => selectFile(file)}
			{...attributes}
			{...listeners}
		>
			<FileContent
				file={file}
				deleteFile={deleteFile}
				fileList={fileList}
			/>
		</div>
	);
};

export default File;
