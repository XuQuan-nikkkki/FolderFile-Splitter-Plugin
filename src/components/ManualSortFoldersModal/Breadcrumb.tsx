import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

type Props = {
	folder: TFolder;
	setFolder: (folder: TFolder | null) => void;
	disabled: boolean;
};
const FolderBreadcrumb = ({ folder, setFolder, disabled }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { getNameOfFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getNameOfFolder: store.getNameOfFolder,
		}))
	);

	const goInToFolder = (f: TFolder | null) => {
		if (disabled) return;
		setFolder(f);
	};

	const getEnterFolderBtnClassName = () =>
		[
			"ffs__enter-folder-button",
			disabled ? "ffs__enter-folder-button--disabled" : "",
		].join(" ");

	return (
		<div
			className={getEnterFolderBtnClassName()}
			onClick={() => goInToFolder(folder)}
		>
			{getNameOfFolder(folder)}
		</div>
	);
};

export default FolderBreadcrumb;
