import { useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import FileContent, { FileProps } from "./FileContent";
import { FFS_DRAG_FILE } from "src/assets/constants";
import { Draggable } from "./Styled/Sortable";
import { useExplorer } from "./Explorer";

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
		<Draggable
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
		</Draggable>
	);
};

export default File;
