import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useIncludeSubTagFiles } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import FilesCount from "../FilesCount";

type Props = {
	tag: TagNode;
};
const TagFilesCount = ({ tag }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { getFilesCountInTag } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFilesCountInTag: store.getFilesCountInTag,
		}))
	);

	const { includeSubTagFiles } = useIncludeSubTagFiles(
		settings.includeSubTagFiles
	);

	return (
		<FilesCount
			getFilesCount={() => getFilesCountInTag(tag)}
			includeSubItemFiles={includeSubTagFiles}
			childrenLen={tag.subTagPaths.size}
		/>
	);
};

export default TagFilesCount;
