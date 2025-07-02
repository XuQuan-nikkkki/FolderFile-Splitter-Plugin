import { useDraggable } from "@dnd-kit/core";
import { TFile } from "obsidian";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { FFS_DRAG_FILE } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import FileContent from "./Content";
import { getPopupInfo } from "./popupInfo";

type Props =  {
	file: TFile
	onOpenFoldersPane: () => void;
	disableDrag?: boolean;
};
const File = ({ file, disableDrag, onOpenFoldersPane }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { selectFileAndOpen } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			selectFileAndOpen: store.selectFileAndOpen,
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
			style={{ opacity: isDragging ? 0.5 : 1 }}
			onClick={() => selectFileAndOpen(file)}
			data-tooltip-position="right"
			aria-label={getPopupInfo(file)}
			{...attributes}
			{...listeners}
		>
			<FileContent file={file} />
		</div>
	);
};

export default File;
