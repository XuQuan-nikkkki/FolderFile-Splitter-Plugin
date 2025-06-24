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
			}))
		);

	const hasNoPinnedFolders = getDisplayedPinnedFolders().length === 0;
	const hasNoPinnedTags = getDisplayedPinnedTags().length === 0;

	if (hasNoPinnedFolders && hasNoPinnedTags) return null;

	const renderPinnedFolders = () => {
		return getDisplayedPinnedFolders().map((folder) => {
			return folder ? renderFolder(folder, RENDER_OPTIONS) : null;
		});
	};

	const renderPinnedTags = () => {
		return getDisplayedPinnedTags().map((tag) => {
			return tag ? renderTag(tag, RENDER_OPTIONS) : null;
		});
	};

	return (
		<PinContainer>
			<PinHeader />
			<PinContent style={{ marginLeft: 4 }}>
				{renderPinnedFolders()}
				{renderPinnedTags()}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFoldersAndTags;
