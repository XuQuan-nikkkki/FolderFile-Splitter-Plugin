import { SearchIcon } from "src/assets/icons";

import SearchField from "./Field";
import SearchInput from "./Input";
import SearchScope from "./Scope";

const Search = () => {
	const renderInputRow = () => (
		<div className="ffs__search--input-row">
			<span className="ffs__search-icon-wrapper">
				<SearchIcon className="ffs__search-icon" />
			</span>
			<SearchInput />
      
		</div>
	);

	const renderSearchOptions = () => (
		<div className="ffs__search--options">
			<SearchScope />
			{/* <SearchField /> */}
		</div>
	);

	return (
		<>
			{renderInputRow()}
			{renderSearchOptions()}
		</>
	);
};


export default Search;
