import { useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { ExpandIcon, CollapseIcon } from "src/assets/icons";
import { FileTreeStore } from "src/store";
import StyledActionIconWrapper from "../Styled/ActionIconWrapper";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
};
const ToggleFolders = ({ useFileTreeStore }: Props) => {
	const { folders, restoreExpandedFolderPaths } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			folders: store.folders,
			restoreExpandedFolderPaths: store.changeExpandedFolderPaths,
		}))
	);

	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const onToggleAllFolders = () => {
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
