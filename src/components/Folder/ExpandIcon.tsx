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

	const { hasSubFolder, isFolderExpanded } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasSubFolder: store.hasSubFolder,
			isFolderExpanded: store.isFolderExpanded,
		}))
	);

	return (
		<ExpandIcon
			isExpanded={isFolderExpanded(folder)}
			hideIcon={!hasSubFolder(folder)}
		/>
	);
};

export default FolderExpandIcon;
