import { useShallow } from "zustand/react/shallow";

import { FolderIcon, TagIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { SEARCH_TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";
import { SEARCH_SCOPE_TYPE } from "src/store/file/search";

const SearchScope = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const { searchScope, clearSearchScope } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			searchScope: store.searchScope,
			clearSearchScope: store.clearSearchScope,
		}))
	);

	const { allNotes } = SEARCH_TIPS_COPY;
	const scopeClassName = "ffs__search--scope";

	if (!searchScope)
		return <div className={scopeClassName}>{allNotes[language]}</div>;

	const { FOLDER } = SEARCH_SCOPE_TYPE;
	const { type, path } = searchScope;
	const scopeIconClassName = "ffs__search--scope-icon";
	const IconComponent = type === FOLDER ? FolderIcon : TagIcon;

	return (
		<div className={scopeClassName}>
			<IconComponent className={scopeIconClassName} />
			{path}
			<span
				className="ffs__search--remove-option"
				onClick={clearSearchScope}
				data-tooltip-position="bottom"
			>
				╳
			</span>
		</div>
	);
};

export default SearchScope;
