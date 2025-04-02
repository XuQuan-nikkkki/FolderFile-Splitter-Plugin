import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExpandIcon, CollapseIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import { StyledActionButtonWrapper } from "../layout/Actions";
import { useExplorer } from "src/hooks/useExplorer";

const ToggleFolders = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const { restoreExpandedFolderPaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			restoreExpandedFolderPaths: store.changeExpandedFolderPaths,
		}))
	);

	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const onToggleAllFolders = () => {
		const folders = plugin.app.vault.getAllFolders();
		if (isExpanded) {
			restoreExpandedFolderPaths([]);
		} else {
			restoreExpandedFolderPaths(folders.map((f) => f.path));
		}
		setIsExpanded(!isExpanded);
	};

	return (
		<StyledActionButtonWrapper onClick={onToggleAllFolders}>
			{isExpanded ? (
				<CollapseIcon className="ffs__action-button" />
			) : (
				<ExpandIcon className="ffs__action-button" />
			)}
		</StyledActionButtonWrapper>
	);
};

export default ToggleFolders;
