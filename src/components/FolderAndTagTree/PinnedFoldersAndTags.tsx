import { TFolder } from "obsidian";
import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import { PinContainer, PinContent, PinHeader } from "../Pin";

export type RenderOptions = {
	hideExpandIcon?: boolean;
	disableDrag?: boolean;
	disableHoverIndent?: boolean;
};
const RENDER_OPTIONS: RenderOptions = {
	hideExpandIcon: true,
	disableDrag: true,
	disableHoverIndent: true,
};

type Props = {
	renderFolder: (folder: TFolder, options: RenderOptions) => ReactNode;
	renderTag: (tag: TagNode, options: RenderOptions) => ReactNode;
};
const PinnedFoldersAndTags = ({ renderFolder, renderTag }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { getDisplayedPinnedFolders, getDisplayedPinnedTags } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				getDisplayedPinnedFolders: store.getDisplayedPinnedFolders,
				getDisplayedPinnedTags: store.getDisplayedPinnedTags,
				// for dependency tracking only
				pinnedTagPaths: store.pinnedTagPaths,
			}))
		);

	const pinnedFolders = getDisplayedPinnedFolders();
	const pinnedTags = getDisplayedPinnedTags();

	if (pinnedFolders.length === 0 && pinnedTags.length === 0) return null;

	return (
		<PinContainer>
			<PinHeader />
			<PinContent style={{ marginLeft: 4 }}>
				{getDisplayedPinnedFolders().map((folder) =>
					renderFolder(folder, RENDER_OPTIONS)
				)}
				{getDisplayedPinnedTags().map((tag) =>
					renderTag(tag, RENDER_OPTIONS)
				)}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFoldersAndTags;
