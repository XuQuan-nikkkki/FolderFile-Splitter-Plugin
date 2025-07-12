import { StateCreator } from "zustand";

import { FFS_FOCUSED_TAG_PATH_KEY } from "src/assets/constants";
import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";
import { VIEW_MODE } from "../common";

import { TagNode } from ".";

export interface FocusedTagSlice {
	focusedTag: TagNode | null;

	isFocusedTag: (tag: TagNode) => boolean;
	setFocusedTagAndSave: (tag: TagNode | null) => void;

	changeFocusedTag: (folder: TagNode | null) => Promise<void>;
	restoreLastFocusedTag: () => void;
}

export const createFocusedTagSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedTagSlice> =>
	(set, get) => ({
		focusedTag: null,

		isFocusedTag: (tag: TagNode) => {
			return get().focusedTag?.fullPath === tag.fullPath;
		},

		setFocusedTagAndSave: (tag: TagNode | null) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "focusedTag",
				value: tag,
				localStorageKey: FFS_FOCUSED_TAG_PATH_KEY,
				localStorageValue: tag ? tag.fullPath : "",
			});
		},

		changeFocusedTag: async (tag: TagNode) => {
			const {
				focusedFile,
				changeToTagMode,
				setFocusedTagAndSave,
				setFocusedFolderAndSave,
				viewMode,
				clearFocusedFile,
				isFileHasTag,
			} = get();

			setFocusedTagAndSave(tag);
			setFocusedFolderAndSave(null);
			if (viewMode !== VIEW_MODE.TAG) {
				changeToTagMode();
			}
			if (focusedFile && !isFileHasTag(focusedFile, tag)) {
				clearFocusedFile();
			}
		},

		restoreLastFocusedTag: () => {
			const { restoreDataFromLocalStorage, getTagByPath } = get();
			restoreDataFromLocalStorage({
				localStorageKey: FFS_FOCUSED_TAG_PATH_KEY,
				key: "focusedTag",
				transform: getTagByPath,
				validate: (tag) => Boolean(tag),
			});
		},
	});
