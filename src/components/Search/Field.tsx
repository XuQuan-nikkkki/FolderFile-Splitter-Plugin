import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { SEARCH_TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";
import { SEARCH_FIELD } from "src/store/file/search";

const SearchField = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const { searchField, toggleSearchField } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			searchField: store.searchField,
			toggleSearchField: store.toggleSearchField,
		}))
	);

	const isTitleOnly = searchField === SEARCH_FIELD.TITLE_ONLY;

	const { searchTitleOnly, searchFullText, titleOnly, fullText } =
		SEARCH_TIPS_COPY;
	const popupCopy = isTitleOnly ? searchFullText : searchTitleOnly;
	const textCopy = isTitleOnly ? fullText : titleOnly;

	return (
		<div
			className={classNames("ffs__search--field")}
			data-tooltip-position="bottom"
			aria-label={popupCopy[language]}
			onClick={toggleSearchField}
		>
			{textCopy[language]}
		</div>
	);
};

export default SearchField;
