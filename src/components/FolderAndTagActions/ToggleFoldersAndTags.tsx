import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExpandIcon, CollapseIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";

const ToggleFolders = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings, language } = plugin;

	const {
		changeExpandedFolderPaths,
		expandedFolderPaths,
		expandedTagPaths,
		changeExpandedTagPaths,
		tagTree,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			changeExpandedFolderPaths: store.changeExpandedFolderPaths,
			expandedFolderPaths: store.expandedFolderPaths,
			expandedTagPaths: store.expandedTagPaths,
			changeExpandedTagPaths: store.changeExpandedTagPaths,
			tagTree: store.tagTree,
		}))
	);

	const { showFolderView } = useShowFolderView(settings.showFolderView);
	const { showTagView } = useShowTagView(settings.showTagView);

	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		const hassFolderExpanded =
			showFolderView && expandedFolderPaths.length > 0;
		const hasTagExpanded = showTagView && expandedTagPaths.length > 0;
		setIsExpanded(hassFolderExpanded || hasTagExpanded);
	}, [expandedFolderPaths, expandedTagPaths, showFolderView, showTagView]);

	const onToggleAllFolders = () => {
		const folders = plugin.app.vault.getAllFolders();
		const tags = Array.from(tagTree.keys());
		if (isExpanded) {
			changeExpandedFolderPaths([]);
			changeExpandedTagPaths([]);
		} else {
			changeExpandedFolderPaths(folders.map((f) => f.path));
			changeExpandedTagPaths(tags);
		}
		setIsExpanded(!isExpanded);
	};

	return (
		<div
			className="ffs__action-button-wrapper clickable-icon nav-action-button"
			onClick={onToggleAllFolders}
			aria-label={
				TIPS_COPY[
					isExpanded
						? "collapseFoldersAndTags"
						: "expandFoldersAndTags"
				][language]
			}
			data-tooltip-position="bottom"
		>
			{isExpanded ? (
				<CollapseIcon className="ffs__action-button svg-icon" />
			) : (
				<ExpandIcon className="ffs__action-button svg-icon" />
			)}
		</div>
	);
};

export default ToggleFolders;
