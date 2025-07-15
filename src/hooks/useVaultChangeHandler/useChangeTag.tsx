import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import {
	MetadataCacheChangeEvent,
	MetadataCacheChangeEventName,
} from "src/assets/constants";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import { useExplorer } from "../useExplorer";

const useChangeTag = () => {
	const { useExplorerStore } = useExplorer();

	const { getTopLevelTags, generateTagTree } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getTopLevelTags: store.getTopLevelTags,
			generateTagTree: store.generateTagTree,
		}))
	);

	const [topTags, setTopTags] = useState<TagNode[]>([]);

	const onUpdateTopTags = () => {
		const topLevelTags = getTopLevelTags();
		setTopTags(topLevelTags);
	};

	useEffect(() => {
		onUpdateTopTags();
	}, []);

	useEffect(() => {
		window.addEventListener(
			MetadataCacheChangeEventName,
			onHandleMetadataCacheChange
		);
		return () => {
			window.removeEventListener(
				MetadataCacheChangeEventName,
				onHandleMetadataCacheChange
			);
		};
	}, []);

	const onHandleMetadataCacheChange = async (
		event: MetadataCacheChangeEvent
	) => {
		const { cache } = event.detail;
		if (!cache.tags?.length) return;
		generateTagTree();
		onUpdateTopTags();
	};

	return { topTags };
};

export default useChangeTag;
