import classNames from "classnames";
import { useShallow } from "zustand/react/shallow";

import { SearchIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { SEARCH_SCOPE_TYPE } from "src/store/file/search";

const SearchFiles = () => {
	const { useExplorerStore } = useExplorer();

	const { changeToSearchMode, focusedFolder, focusedTag, changeSearchScope } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				changeToSearchMode: store.changeToSearchMode,
				focusedFolder: store.focusedFolder,
				focusedTag: store.focusedTag,
				changeSearchScope: store.changeSearchScope,
			}))
		);

	const getClassNames = () => {
		return classNames(
			"ffs__action-button-wrapper clickable-icon nav-action-button"
		);
	};

	const onBeginSearch = () => {
		changeToSearchMode();
		if (focusedFolder) {
			changeSearchScope({
				type: SEARCH_SCOPE_TYPE.FOLDER,
				path: focusedFolder.path,
			});
		} else if (focusedTag) {
			changeSearchScope({
				type: SEARCH_SCOPE_TYPE.TAG,
				path: focusedTag.fullPath,
			});
		}
	};

	return (
		<div className={getClassNames()} onClick={onBeginSearch}>
			<SearchIcon className="ffs__action-button svg-icon" />
		</div>
	);
};

export default SearchFiles;
