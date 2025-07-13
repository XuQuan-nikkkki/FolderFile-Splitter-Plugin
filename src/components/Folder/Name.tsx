import { TFolder } from "obsidian";
import { forwardRef, RefObject, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import EditableName, { NameRef } from "../EditableName";

export type FolderProps = {
	folder: TFolder;
	contentRef: RefObject<HTMLDivElement | null>;
};
type Props = FolderProps;
const FolderName = forwardRef(
	({ folder, contentRef }: Props, ref: RefObject<NameRef>) => {
		const { useExplorerStore } = useExplorer();

		const {
			renameFolder,
			getNameOfFolder,
			isLastCreatedFolder,
			isFocusedFolder,
			getSubFolders,
		} = useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				renameFolder: store.renameFolder,
				getNameOfFolder: store.getNameOfFolder,
				isLastCreatedFolder: store.isLastCreatedFolder,
				isFocusedFolder: store.isFocusedFolder,
				getSubFolders: store.getSubFolders,
			}))
		);

		useEffect(() => {
			if (isLastCreatedFolder(folder)) {
				ref.current?.onStartEditingName();
			}
		}, []);

		const folders = folder.parent ? getSubFolders(folder.parent) : [];
		return (
			<EditableName
				ref={ref}
				names={folders.map((f) => f.name)}
				isFocused={isFocusedFolder(folder)}
				contentRef={contentRef}
				defaultName={getNameOfFolder(folder)}
				className="ffs__folder-name"
				onSaveName={async (name: string) =>
					await renameFolder(folder, name)
				}
			/>
		);
	}
);

export default FolderName;
