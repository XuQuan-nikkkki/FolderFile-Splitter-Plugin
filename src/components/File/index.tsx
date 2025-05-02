import { useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { FFS_DRAG_FILE } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";

import FileContent, { FileProps } from "./Content";
import dayjs from "dayjs";

type Props = FileProps & {
	onOpenFoldersPane: () => void;
	disableDrag?: boolean;
};
const File = ({ file, deleteFile, disableDrag, onOpenFoldersPane }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

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

	const getAriaLabel = () => {
		const { basename, stat } = file;
		const { ctime, mtime } = stat;
		const format = "YYYY-MM-DD HH:mm";

		const modifiedInfo = dayjs(mtime).format(format);
		const createdInfo = dayjs(ctime).format(format);

		if (language === "en") {
			return `${basename}\nLast modified at ${modifiedInfo}\nCreated at ${createdInfo}`;
		}
		return `${basename}\n最后修改于 ${modifiedInfo}\n创建于 ${createdInfo}`;
	};

	return (
		<div
			className="ffs__file-tree-item tree-item nav-file"
			ref={setNodeRef}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			onClick={() => selectFile(file)}
			{...attributes}
			{...listeners}
			data-tooltip-position="right"
			aria-label={getAriaLabel()}
		>
			<FileContent file={file} deleteFile={deleteFile} />
		</div>
	);
};

export default File;
