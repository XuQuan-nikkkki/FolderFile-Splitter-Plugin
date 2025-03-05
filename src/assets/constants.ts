import { TAbstractFile } from "obsidian";

export const FFS_FOCUSED_FOLDER_PATH_KEY = "FocusedFolderPath";
export const FFS_EXPANDED_FOLDER_PATHS_KEY = "ExpandedFolderPaths";
export const FFS_FOCUSED_FILE_PATH_KEY = "FocusedFilePath";
export const FFS_FOLDER_SORT_RULE_KEY = "FolderSortRule";
export const FFS_FILE_SORT_RULE_KEY = "FileSortRule";
export const FFS_PINNED_FOLDER_PATHS_KEY = "PinnedFolderPaths";
export const FFS_PINNED_FILE_PATHS_KEY = "PinnedFilePaths";

export const FFS_FOLDER_PANE_WIDTH_KEY =
	"FolderFileSplitterPlugin-FolderPaneWidth";

export const VaultChangeEventName = "FFS-VaultChangeEvent";
export type VaultChangeType = "create" | "modify" | "delete" | "rename";
export type VaultChangeEvent = CustomEvent<{
	file: TAbstractFile;
	changeType: VaultChangeType;
}>;

export const FFS_PLUGIN_SETTINGS = "FolderFileSplitterPlugin-Settings";
export const SettingsChangeEventName = "FFS-SettingsChangeEvent";

export const FFS_DRAG_FILES_TYPE = "FFS-FILES";
export const FFS_DRAG_FOLDERS_TYPE = "FFS-FOLDERS";
