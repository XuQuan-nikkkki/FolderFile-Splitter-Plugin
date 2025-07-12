import { Notice, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOCUSED_FOLDER_PATH_KEY } from "src/assets/constants";
import { NOTIFICATION_MESSAGE_COPY } from "src/locales/message";
import FolderFileSplitterPlugin from "src/main";
import { FOLDER_NOTE_MISSING_BEHAVIOR } from "src/settings";

import { ExplorerStore } from "..";
import { VIEW_MODE } from "../common";

export interface FocusedFolderSlice {
	focusedFolder: TFolder | null;

	isFocusedFolder: (folder: TFolder) => boolean;
	setFocusedFolderAndSave: (folder: TFolder | null) => void;

	changeFocusedFolder: (folder: TFolder | null) => Promise<void>;
	restoreLastFocusedFolder: () => void;

	openFolderNote: (folder: TFolder) => Promise<void>;
	handleMissingFolderNote: (folderNotePath: string) => Promise<void>;
}

export const createFocusedFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedFolderSlice> =>
	(set, get) => ({
		focusedFolder: null,

		isFocusedFolder: (folder: TFolder) => {
			return get().focusedFolder?.path === folder.path;
		},

		setFocusedFolderAndSave: (folder: TFolder | null) => {
			const { setValueAndSaveInLocalStorage } = get();
			setValueAndSaveInLocalStorage({
				key: "focusedFolder",
				value: folder,
				localStorageKey: FFS_FOCUSED_FOLDER_PATH_KEY,
				localStorageValue: folder ? folder.path : "",
			});
		},

		changeFocusedFolder: async (folder: TFolder) => {
			const {
				focusedFile,
				setFocusedFolderAndSave,
				setFocusedTagAndSave,
				changeToFolderMode,
				openFolderNote,
				clearFocusedFile,
				viewMode,
				isFileInFolder,
			} = get();

			setFocusedFolderAndSave(folder);
			setFocusedTagAndSave(null);
			if (viewMode !== VIEW_MODE.FOLDER) {
				changeToFolderMode();
			}
			if (plugin.settings.autoOpenFolderNote) {
				await openFolderNote(folder);
			}
			if (focusedFile && !isFileInFolder(focusedFile, folder)) {
				clearFocusedFile();
			}
		},

		openFolderNote: async (folder: TFolder) => {
			const {
				selectFileAndOpen,
				getFolderNotePath,
				findFileByPath,
				handleMissingFolderNote,
			} = get();

			const folderNotePath = getFolderNotePath(folder);
			const folderNote = findFileByPath(folderNotePath);
			if (folderNote) {
				selectFileAndOpen(folderNote);
			} else {
				await handleMissingFolderNote(folderNotePath);
			}
		},

		handleMissingFolderNote: async (folderNotePath: string) => {
			const { createFileAndOpen } = get();
			const { settings, language } = plugin;
			const { folderNoteMissingBehavior: behavior } = settings;
			const { WARN, CREATE } = FOLDER_NOTE_MISSING_BEHAVIOR;
			const { folderNoteMissing } = NOTIFICATION_MESSAGE_COPY;

			if (behavior === WARN) {
				new Notice(`${folderNoteMissing[language]}'${folderNotePath}'`);
				return;
			}
			if (behavior === CREATE) {
				await createFileAndOpen(folderNotePath);
			}
		},

		restoreLastFocusedFolder: () => {
			const {
				findFolderByPath,
				rootFolder,
				restoreDataFromLocalStorage,
			} = get();
			restoreDataFromLocalStorage({
				localStorageKey: FFS_FOCUSED_FOLDER_PATH_KEY,
				key: "focusedFolder",
				transform: (path: string) =>
					path === "/" ? rootFolder : findFolderByPath(path),
				validate: (folder) => Boolean(folder),
			});
		},
	});
