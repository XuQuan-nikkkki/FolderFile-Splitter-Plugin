import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExpandIcon, CollapseIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";

const ToggleFolders = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const {
		hasFolderExpanded,
		hasTagExpanded,
		expandAllFolders,
		collapseAllFolders,
		expandAllTags,
		collapseAllTags,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			hasFolderExpanded: store.hasFolderExpanded,
			hasTagExpanded: store.hasTagExpanded,
			expandAllFolders: store.expandAllFolders,
			collapseAllFolders: store.collapseAllFolders,
			expandAllTags: store.expandAllTags,
			collapseAllTags: store.collapseAllTags,

			// for dependency tracking only
			expandedFolderPaths: store.expandedFolderPaths,
			expandedTagPaths: store.expandedTagPaths,
		}))
	);

	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		setIsExpanded(hasFolderExpanded() || hasTagExpanded());
	}, [hasFolderExpanded(), hasTagExpanded()]);

	const onToggleAllFolders = () => {
		if (isExpanded) {
			collapseAllFolders();
			collapseAllTags();
		} else {
			expandAllFolders();
			expandAllTags();
		}
		setIsExpanded(!isExpanded);
	};

	const getAriaLabel = () => {
		const { collapseFoldersAndTags, expandFoldersAndTags } = TIPS_COPY;
		const copy = isExpanded ? collapseFoldersAndTags : expandFoldersAndTags;
		return copy[language];
	};

	const renderIcon = () => {
		const IconComponent = isExpanded ? CollapseIcon : ExpandIcon;
		return <IconComponent className="ffs__action-button svg-icon" />;
	};

	return (
		<div
			className="ffs__action-button-wrapper clickable-icon nav-action-button"
			onClick={onToggleAllFolders}
			aria-label={getAriaLabel()}
			data-tooltip-position="bottom"
		>
			{renderIcon()}
		</div>
	);
};

export default ToggleFolders;
