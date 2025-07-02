import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useHideRootFolder,
	useShowFolderView,
} from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";

import Folder from "../Folder";

const RootFolder = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const { rootFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			rootFolder: store.rootFolder,
		}))
	);

	const {
		hideRootFolder: defaultHideRootFolder,
		showFolderView: defaultShowFolderView,
	} = plugin.settings;
	const { hideRootFolder } = useHideRootFolder(defaultHideRootFolder);
	const { showFolderView } = useShowFolderView(defaultShowFolderView);

	if (!rootFolder || hideRootFolder || !showFolderView) return null;

	return (
		<div className="ffs__folder-tree-item tree-item nav-folder">
			<Folder key={rootFolder.path} folder={rootFolder} />
		</div>
	);
};

export default RootFolder;
