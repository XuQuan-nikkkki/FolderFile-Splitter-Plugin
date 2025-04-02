import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ExplorerStore } from "src/store";
import { StyledIcon } from "../Styled/DragIcon";
import { FFS_SORT_FOLDER } from "src/assets/constants";

const DraggableSection = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;
`;

const StyledFolder = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 8px;
	height: 30px;
	align-items: center;
	padding: 4px;
	border-radius: var(--ffs-border-radius);
	touch-action: none;

	&:hover {
		background-color: var(--interactive-hover);
	}
`;
export const StyledButton = styled.span<{ $disabled?: boolean }>`
	color: ${({ $disabled }) =>
		$disabled
			? "color-mix(in srgb, var(--text-accent), transparent 50%)"
			: "var(--text-accent)"};
	text-decoration: underline;
	cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : undefined)};
`;

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
		<StyledFolder
			ref={setNodeRef}
			id={folder.path}
			style={style}
			{...attributes}
		>
			<DraggableSection {...listeners}>
				<StyledIcon />
				<div>{folder.name}</div>
			</DraggableSection>
			{subfolders.length > 0 && (
				<StyledButton
					onClick={(e) => {
						goInToFolder(folder);
					}}
				>
					Sort subfolders
				</StyledButton>
			)}
		</StyledFolder>
	);
};

export default FolderToSort;
