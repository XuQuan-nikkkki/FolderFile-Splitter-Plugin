import { TFolder } from "obsidian";
import { ReactNode, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";
import { uniq } from "src/utils";

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
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const {
		pinnedFolderPaths,
		_updatePinnedFolderPaths,
		pinnedTagPaths,
		tagTree,
		_updatePinnedTagPaths,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			pinnedFolderPaths: store.pinnedFolderPaths,
			_updatePinnedFolderPaths: store._updatePinnedFolderPaths,
			pinnedTagPaths: store.pinnedTagPaths,
			tagTree: store.tagTree,
			_updatePinnedTagPaths: store._updatePinnedTagPaths,
		}))
	);

	const { showFolderView } = useShowFolderView(settings.showFolderView);
	const { showTagView } = useShowTagView(settings.showTagView);

	const clearDuplicates = async (
		uniqItems: string[],
		realItems: string[],
		updater: (items: string[]) => Promise<void>
	) => {
		if (uniqItems.length === realItems.length) return;
		await updater(uniqItems);
	};

	const clearDuplicateFolders = async () => {
		const uniqueFolderPaths = uniq(pinnedFolderPaths).filter((path) =>
			Boolean(plugin.app.vault.getFolderByPath(path))
		);
		await clearDuplicates(
			uniqueFolderPaths,
			pinnedFolderPaths,
			_updatePinnedFolderPaths
		);
	};

	const clearDuplicateTags = async () => {
		const uniqueTagPaths = uniq(pinnedTagPaths).filter((path) =>
			Boolean(tagTree.has(path))
		);
		await clearDuplicates(
			uniqueTagPaths,
			pinnedTagPaths,
			_updatePinnedTagPaths
		);
	};

	useEffect(() => {
		clearDuplicateFolders();
		clearDuplicateTags();
	}, [pinnedFolderPaths, pinnedTagPaths]);

	const hasNoPinnedFolders =
		!showFolderView || pinnedFolderPaths.length === 0;
	const hasNoPinnedTags = !showTagView || pinnedTagPaths.length === 0;

	if (hasNoPinnedFolders && hasNoPinnedTags) return null;

	const renderPinnedFolders = () => {
		if (!showFolderView) return null;
		return pinnedFolderPaths.map((path) => {
			const folder = plugin.app.vault.getFolderByPath(path);
			return folder ? renderFolder(folder, RENDER_OPTIONS) : null;
		});
	};

	const renderPinnedTags = () => {
		if (!showTagView) return null;
		return pinnedTagPaths.map((path) => {
			const tag = tagTree.get(path);
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
