import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ExplorerStore } from "src/store";
import { FFS_SORT_FOLDER } from "src/assets/constants";
import {
	StyledDraggableArea,
	StyledEnterFolderButton,
	StyledManualSortFolder,
} from "./Styled";
import {
	StyledDraggableIcon,
	StyledManualSortItemName,
} from "../Styled/ManualSortModal";

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
		<StyledManualSortFolder
			ref={setNodeRef}
			id={folder.path}
			style={style}
			{...attributes}
		>
			<StyledDraggableArea {...listeners}>
				<StyledDraggableIcon />
				<StyledManualSortItemName>
					{folder.name}
				</StyledManualSortItemName>
			</StyledDraggableArea>
			{subfolders.length > 0 && (
				<StyledEnterFolderButton onClick={() => goInToFolder(folder)}>
					Sort subfolders
				</StyledEnterFolderButton>
			)}
		</StyledManualSortFolder>
	);
};

export default FolderToSort;
