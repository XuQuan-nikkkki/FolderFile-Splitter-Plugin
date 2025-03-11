import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import styled from "styled-components";

import { FileTreeStore, FOLDER_MANUAL_SORT_RULE } from "src/store";
import { FFS_FOLDER } from "src/assets/constants";
import { Draggable } from "../Styled/Sortable";
import { StyledIcon } from "../Styled/DragIcon";

const StyledFolder = styled.div`
	display: grid;
	grid-template-columns: 20px 1fr auto;
	gap: 8px;
	height: 30px;
	align-items: center;
	padding: 4px;
	border-radius: var(--ffs-border-radius);

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
	const {
		order,
		getFoldersByParent,
		folderSortRule,
		changeFoldersManualOrder,
		changeFoldersManualOrderAndSave,
	} = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			order: store.foldersManualSortOrder,
			getFoldersByParent: store.getFoldersByParent,
			folderSortRule: store.folderSortRule,
			changeFoldersManualOrder: store.changeFoldersManualOrder,
			changeFoldersManualOrderAndSave:
				store.changeFoldersManualOrderAndSave,
		}))
	);

	const folderRef = useRef<HTMLDivElement>(null);
	const paths = folder.parent ? order[folder.parent.path] : [];

	const [{ isDragging }, drag] = useDrag(() => ({
		type: FFS_FOLDER,
		item: folder,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	const [, drop] = useDrop(
		() => ({
			accept: FFS_FOLDER,
			hover: (item: TFolder) => {
				if (folderSortRule !== FOLDER_MANUAL_SORT_RULE) return;
				if (item.path !== folder.path) {
					const atIndex = paths.indexOf(folder.path);
					changeFoldersManualOrder(item, atIndex);
				}
			},
			drop: (item) => {
				const atIndex = paths.indexOf(folder.path);
				changeFoldersManualOrderAndSave(item, atIndex);
			},
		}),
		[changeFoldersManualOrder, order, folderSortRule]
	);
	drag(drop(folderRef));

	const subfolders = getFoldersByParent(folder);

	return (
		<Draggable ref={folderRef} style={{ opacity: isDragging ? 0 : 1 }}>
			<StyledFolder>
				<StyledIcon />
				<div>{folder.name}</div>
				{subfolders.length > 0 && (
					<StyledButton onClick={() => goInToFolder(folder)}>
						Sort subfolders
					</StyledButton>
				)}
			</StyledFolder>
		</Draggable>
	);
};

export default FolderToSort;
