import { TAbstractFile } from "obsidian";

export const FFS_FOCUSED_FOLDER_PATH_KEY =
	"FolderFileSplitterPlugin-FocusedFolderPath";
export const FFS_EXPANDED_FOLDER_PATHS_KEY =
	"FolderFileSplitterPlugin-ExpandedFolderPaths";
export const FFS_FOCUSED_FILE_PATH_KEY =
	"FolderFileSplitterPlugin-FocusedFilePath";
export const FFS_FOLDER_SORT_RULE_KEY =
	"FolderFileSplitterPlugin-FolderSortRule";
export const FFS_FILE_SORT_RULE_KEY = "FolderFileSplitterPlugin-FileSortRule";

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
