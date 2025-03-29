import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { StoreApi, UseBoundStore } from "zustand";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { FileTreeStore } from "src/store";
import { StyledIcon } from "../Styled/DragIcon";
import { FFS_SORT_FOLDER } from "src/assets/constants";

const StyledFolder = styled.div`
	display: grid;
	grid-template-columns: 20px 1fr auto;
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
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	goInToFolder: (folder: TFolder | null) => void;
};
const FolderToSort = ({ folder, useFileTreeStore, goInToFolder }: Props) => {
	const { getFoldersByParent } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
			{...listeners}
		>
			<StyledIcon />
			<div>{folder.name}</div>
			{subfolders.length > 0 && (
				<StyledButton onClick={() => goInToFolder(folder)}>
					Sort subfolders
				</StyledButton>
			)}
		</StyledFolder>
	);
};

export default FolderToSort;
