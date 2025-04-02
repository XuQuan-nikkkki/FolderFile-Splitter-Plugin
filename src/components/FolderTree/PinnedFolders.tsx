import { useShallow } from "zustand/react/shallow";
import { TFolder } from "obsidian";
import { ReactNode, useEffect } from "react";

import { ExplorerStore } from "src/store";
import PinIcon from "src/assets/icons/PinIcon";
import { useExplorer } from "src/hooks/useExplorer";

import {
	StyledPinnedContent,
	StyledPinnedContainer,
	StyledPinnedHeader,
	StyledPinTitle,
} from "../Styled/Pin";

export type FolderOptions = {
	isRoot?: boolean;
	hideExpandIcon?: boolean;
	disableDrag?: boolean;
};
type Props = {
	renderFolder: (folder: TFolder, options: FolderOptions) => ReactNode;
};
const PinnedFolders = ({ renderFolder }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { pinnedFolderPaths, _updatePinnedFolderPaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			pinnedFolderPaths: store.pinnedFolderPaths,
			_updatePinnedFolderPaths: store._updatePinnedFolderPaths,
		}))
	);

	useEffect(() => {
		const uniquePaths = [...new Set(pinnedFolderPaths)].filter((path) =>
			Boolean(plugin.app.vault.getFolderByPath(path))
		);
		if (uniquePaths.length !== pinnedFolderPaths.length) {
			_updatePinnedFolderPaths(uniquePaths);
		}
	}, [pinnedFolderPaths]);

	if (!pinnedFolderPaths.length) return null;
	return (
		<StyledPinnedContainer>
			<StyledPinnedHeader>
				<PinIcon />
				<StyledPinTitle>Pin</StyledPinTitle>
			</StyledPinnedHeader>
			<StyledPinnedContent $indent>
				{pinnedFolderPaths.map((path) => {
					const folder = plugin.app.vault.getFolderByPath(path);
					const options: FolderOptions = {
						isRoot: folder?.isRoot(),
						hideExpandIcon: true,
						disableDrag: true,
					};
					return folder ? renderFolder(folder, options) : null;
				})}
			</StyledPinnedContent>
		</StyledPinnedContainer>
	);
};

export default PinnedFolders;
