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

	const { hasSubFolders, expandedFolderPaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasSubFolders: store.hasSubFolders,
			expandedFolderPaths: store.expandedFolderPaths,
		}))
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	return (
		<ExpandIcon
			isExpanded={isFolderExpanded}
			hideIcon={!hasSubFolders(folder)}
		/>
	);
};

export default FolderExpandIcon;
