import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import ExpandIcon from "../ExpandIcon";

type Props = {
	folder: TFolder;
};
const FolderExpandIcon = ({ folder }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { hasSubFolder, expandedFolderPaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasSubFolder: store.hasSubFolder,
			expandedFolderPaths: store.expandedFolderPaths,
		}))
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	return (
		<ExpandIcon
			isExpanded={isFolderExpanded}
			hideIcon={!hasSubFolder(folder)}
		/>
	);
};

export default FolderExpandIcon;
