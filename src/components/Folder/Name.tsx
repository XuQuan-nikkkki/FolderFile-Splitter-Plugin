import { TFolder } from "obsidian";
import {
	ForwardedRef,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { ExplorerStore } from "src/store";

import { FolderInnerContentRef } from "./Content";

export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps;
const FolderName = forwardRef(
	({ folder }: Props, ref: ForwardedRef<FolderInnerContentRef>) => {
		const { useExplorerStore } = useExplorer();

		const {
			renameFolder,
			getNameOfFolder,
			isLastCreatedFolder,
		} = useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				renameFolder: store.renameFolder,
				getNameOfFolder: store.getNameOfFolder,
				isLastCreatedFolder: store.isLastCreatedFolder,
			}))
		);

		const onSaveName = (name: string) => renameFolder(folder, name);
		const folderName = getNameOfFolder(folder);
		const {
			renderEditableName: renderFolderName,
      onStartEditingName,
		} = useRenderEditableName(folderName, onSaveName, {
			className: "ffs__folder-name",
		});

		const folderRef = useRef<HTMLDivElement>(null);
		const [isFocusing, setIsFocusing] = useState<boolean>(false);

		useImperativeHandle(ref, () => ({
			setIsFocusing,
      onStartEditingName
		}));

		const onClickOutside = (event: MouseEvent) => {
			if (
				folderRef.current &&
				!folderRef.current.contains(event.target as Node)
			) {
				setIsFocusing(false);
			}
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && isFocusing) {
				onStartEditingName()
			}
		};

		useEffect(() => {
			window.addEventListener("keydown", onKeyDown);
			window.addEventListener("mousedown", onClickOutside);
			return () => {
				window.removeEventListener("keydown", onKeyDown);
				window.removeEventListener("mousedown", onClickOutside);
			};
		}, [isFocusing]);

		useEffect(() => {
			if (isLastCreatedFolder(folder)) {
				onStartEditingName();
			}
		}, []);

		return renderFolderName();
	}
);

export default FolderName;
