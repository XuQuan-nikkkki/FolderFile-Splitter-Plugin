import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExpandIcon, CollapseIcon } from "src/assets/icons";
import { ExplorerStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";
import { useExplorer } from "../Explorer";

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
		<StyledActionIconWrapper onClick={onToggleAllFolders}>
			{isExpanded ? <CollapseIcon /> : <ExpandIcon />}
		</StyledActionIconWrapper>
	);
};

export default ToggleFolders;
