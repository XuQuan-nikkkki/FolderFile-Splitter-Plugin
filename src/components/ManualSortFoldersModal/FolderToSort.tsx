import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FFS_SORT_FOLDER } from "src/assets/constants";
import { GripIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";

type Props = {
	folder: TFolder;
	useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>;
	goInToFolder: (folder: TFolder | null) => void;
};
const FolderToSort = ({ folder, useExplorerStore, goInToFolder }: Props) => {
	const { getFoldersByParent } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFoldersByParent: store.getFoldersByParent,
		}))
	);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: folder.path,
		data: { item: folder, type: FFS_SORT_FOLDER },
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const subfolders = getFoldersByParent(folder);
	return (
		<div
			className="ffs__manual-sort-item--folder"
			ref={setNodeRef}
			id={folder.path}
			style={style}
			{...attributes}
		>
			<div className="ffs__draggable-area" {...listeners}>
				<GripIcon className="ffs__draggable-icon" />
				<div className="ffs__manual-sort-item-name">{folder.name}</div>
			</div>
			{subfolders.length > 0 && (
				<div
					className="ffs__enter-folder-button"
					onClick={() => goInToFolder(folder)}
				>
					Sort subfolders
				</div>
			)}
		</div>
	);
};

export default FolderToSort;
