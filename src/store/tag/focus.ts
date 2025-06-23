import { StateCreator } from "zustand";

import { FFS_FOCUSED_TAG_PATH_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

import { TagNode } from ".";

export interface FocusedTagSlice {
	focusedTag: TagNode | null;

	_setFocusedTag: (tag: TagNode | null) => void;
	setFocusedTag: (folder: TagNode | null) => Promise<void>;
	restoreLastFocusedTag: () => Promise<void>;
}

export const createFocusedTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedTagSlice> =>
	(set, get) => ({
		focusedTag: null,

		_setFocusedTag: (tag: TagNode | null) =>
			set({
				focusedTag: tag,
			}),
		setFocusedTag: async (tag: TagNode | null) => {
			const {
				_setFocusedTag,
				focusedFile,
				setFocusedFile,
				setFocusedFolder,
				saveDataInLocalStorage,
				removeDataFromLocalStorage,
			} = get();
			_setFocusedTag(tag);

			if (tag) {
				setFocusedFolder(null);
				saveDataInLocalStorage(FFS_FOCUSED_TAG_PATH_KEY, tag.fullPath);

				if (!focusedFile) return;
				const tagsOfFocusedFile =
					plugin.app.metadataCache.getFileCache(focusedFile)?.tags ??
					[];
				if (tagsOfFocusedFile.every((t) => t.tag !== tag?.fullPath)) {
					await setFocusedFile(null);
				}
			} else {
				removeDataFromLocalStorage(FFS_FOCUSED_TAG_PATH_KEY);
			}
		},

		restoreLastFocusedTag: async () => {
			const { getDataFromLocalStorage, tagTree, setFocusedTag } = get();
			const lastFocusedTagPath = getDataFromLocalStorage(
				FFS_FOCUSED_TAG_PATH_KEY
			);
			if (!lastFocusedTagPath) return;
			const tag = tagTree.get(lastFocusedTagPath);
			if (tag) {
				setFocusedTag(tag);
			}
		},
	});
