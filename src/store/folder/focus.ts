import { Notice, TFolder } from "obsidian";
import { StateCreator } from "zustand";

import { FFS_FOCUSED_FOLDER_PATH_KEY } from "src/assets/constants";
import { NOTIFICATION_MESSAGE_COPY } from "src/locales/message";
import FolderFileSplitterPlugin from "src/main";
import { FOLDER_NOTE_LOCATION, FOLDER_NOTE_MISSING_BEHAVIOR } from "src/settings";

import { ExplorerStore } from "..";

export interface FocusedFolderSlice {

		focusedFolder: TFolder | null;


		_setFocusedFolder: (folder: TFolder | null) => void;
		setFocusedFolder: (folder: TFolder | null) => Promise<void>;
		restoreLastFocusedFolder: () => Promise<void>;
}

export const createFocusedFolderSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], FocusedFolderSlice> =>
	(set, get) => ({
		focusedFolder: null,

		_setFocusedFolder: (folder: TFolder | null) =>
			set({
				focusedFolder: folder,
			}),
		setFocusedFolder: async (folder: TFolder | null) => {
			const {
				_setFocusedFolder,
				focusedFile,
				setFocusedFile,
				saveDataInLocalStorage,
				removeDataFromLocalStorage,
				selectFile,
				setFocusedTag,
			} = get();
			_setFocusedFolder(folder);

			if (!folder) {
				removeDataFromLocalStorage(FFS_FOCUSED_FOLDER_PATH_KEY);
			} else {
				setFocusedTag(null);
				saveDataInLocalStorage(
					FFS_FOCUSED_FOLDER_PATH_KEY,
					folder.path
				);

				const { settings, language } = plugin;
				const {
					autoOpenFolderNote,
					folderNoteLocation,
					customFolderNotePath,
					folderNoteMissingBehavior,
				} = settings;
				const { IGNORE, WARN, CREATE } = FOLDER_NOTE_MISSING_BEHAVIOR;
				if (autoOpenFolderNote) {
					let folderNotePath = "";
					if (
						[
							FOLDER_NOTE_LOCATION.INDEX_FILE,
							FOLDER_NOTE_LOCATION.UNDERSCORE_FILE,
						].includes(folderNoteLocation)
					) {
						folderNotePath = `${folder?.path}/${folderNoteLocation}`;
					} else if (
						folderNoteLocation ===
						FOLDER_NOTE_LOCATION.FOLDER_NAME_FILE
					) {
						folderNotePath = `${folder?.path}/${folder?.name}.md`;
					} else {
						folderNotePath = customFolderNotePath.replace(
							"{folder}",
							folder?.name || ""
						);
					}
					const file = plugin.app.vault.getFileByPath(folderNotePath);
					if (file) {
						await selectFile(file);
					} else {
						if (folderNoteMissingBehavior === IGNORE) return;
						if (folderNoteMissingBehavior === WARN) {
							new Notice(
								`${NOTIFICATION_MESSAGE_COPY.folderNoteMissing[language]}'${folderNotePath}'`
							);
						} else if (folderNoteMissingBehavior === CREATE) {
							const newFile = await plugin.app.vault.create(
								folderNotePath,
								""
							);
							await selectFile(newFile);
						}
					}
				} else if (focusedFile?.parent?.path !== folder?.path) {
					await setFocusedFile(null);
				}
			}
		},
		restoreLastFocusedFolder: async () => {
			const { getDataFromLocalStorage } = get();
			const lastFocusedFolderPath = getDataFromLocalStorage(
				FFS_FOCUSED_FOLDER_PATH_KEY
			);
			const { rootFolder, _setFocusedFolder: _setFocusedFolder } = get();
			if (!lastFocusedFolderPath) return;
			if (lastFocusedFolderPath !== "/") {
				const folder = plugin.app.vault.getFolderByPath(
					lastFocusedFolderPath
				);
				if (folder) {
					_setFocusedFolder(folder);
				}
			} else if (rootFolder) {
				_setFocusedFolder(rootFolder);
			}
		},
	});
