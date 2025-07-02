import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import Folder from "../Folder";
import { PinContainer, PinContent, PinHeader } from "../Pin";
import Tag from "../Tag";

const PinnedFoldersAndTags = () => {
	const { useExplorerStore } = useExplorer();

	const { getDisplayedPinnedFolders, getDisplayedPinnedTags } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				getDisplayedPinnedFolders: store.getDisplayedPinnedFolders,
				getDisplayedPinnedTags: store.getDisplayedPinnedTags,

				// for dependency tracking only
				pinnedFolderPaths: store.pinnedFolderPaths,
				pinnedTagPaths: store.pinnedTagPaths,
			}))
		);

	const pinnedFolders = getDisplayedPinnedFolders();
	const pinnedTags = getDisplayedPinnedTags();

	if (pinnedFolders.length === 0 && pinnedTags.length === 0) return null;

	return (
		<PinContainer>
			<PinHeader />
			<PinContent style={{ marginLeft: 4 }}>
				{getDisplayedPinnedFolders().map((folder) => (
					<Folder
						key={folder.path}
						folder={folder}
						hideExpandIcon
						disableDrag
						disableHoverIndent
					/>
				))}
				{getDisplayedPinnedTags().map((tag) => (
					<Tag
						key={tag.name}
						tag={tag}
						hideExpandIcon
						disableHoverIndent
					/>
				))}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFoldersAndTags;
