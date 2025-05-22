import { TFolder } from "obsidian";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";
import ExpandIcon from "../ExpandIcon";

type Props = {
	folder: TFolder;
};
const FolderExpandIcon = ({ folder }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { hasFolderChildren, expandedFolderPaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasFolderChildren: store.hasFolderChildren,
			expandedFolderPaths: store.expandedFolderPaths,
		}))
	);

	const isFolderExpanded = expandedFolderPaths.includes(folder.path);

	return (
		<ExpandIcon
			isExpanded={isFolderExpanded}
			hideIcon={!hasFolderChildren(folder)}
		/>
	);
};

export default FolderExpandIcon;
