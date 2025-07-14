import { debounce } from "obsidian";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { SEARCH_TIPS_COPY } from "src/locales";
import { ExplorerStore } from "src/store";

const SearchInput = () => {
	const { useExplorerStore, plugin } = useExplorer();
	const { language } = plugin;

	const { changeQuery, searchByQuery, searchScope, searchField } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				changeQuery: store.changeQuery,
				searchByQuery: store.searchByQuery,
				searchScope: store.searchScope,
				searchField: store.searchField,
			}))
		);

	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		setTimeout(() => {
			inputRef.current?.focus();
		}, 100);
	}, []);

	const debouncedOnSearch = useRef(debounce(searchByQuery, 300)).current;

	useEffect(() => {
		searchByQuery();
	}, [searchScope, searchField]);

	return (
		<input
			type="search"
			ref={inputRef}
			placeholder={SEARCH_TIPS_COPY.inputToSearch[language]}
			className="ffs__search-input"
			onChange={(e) => {
				const { value } = e.target;
				changeQuery(value);
				debouncedOnSearch();
			}}
		/>
	);
};

export default SearchInput;
