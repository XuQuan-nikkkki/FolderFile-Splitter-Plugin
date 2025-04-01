import { TAbstractFile, WorkspaceLeaf } from "obsidian";

export const FFS_FOCUSED_FOLDER_PATH_KEY = "FocusedFolderPath";
export const FFS_EXPANDED_FOLDER_PATHS_KEY = "ExpandedFolderPaths";
export const FFS_FOCUSED_FILE_PATH_KEY = "FocusedFilePath";
export const FFS_FOLDER_SORT_RULE_KEY = "FolderSortRule";
export const FFS_FILE_SORT_RULE_KEY = "FileSortRule";
export const FFS_PINNED_FOLDER_PATHS_KEY = "PinnedFolderPaths";
export const FFS_PINNED_FILE_PATHS_KEY = "PinnedFilePaths";
export const FFS_FILE_MANUAL_SORT_ORDER_KEY = "FileManualSortOrder";
export const FFS_FOLDER_MANUAL_SORT_ORDER_KEY = "FolderManualSortOrder";

export const FFS_FOLDER_PANE_WIDTH_KEY =
	"FolderFileSplitterPlugin-FolderPaneWidth";
export const FFS_FOLDER_PANE_HEIGHT_KEY =
	"FolderFileSplitterPlugin-FolderPaneHeight";

export const VaultChangeEventName = "FFS-VaultChangeEvent";
export type VaultChangeType = "create" | "modify" | "delete" | "rename";
export type VaultChangeEvent = CustomEvent<{
	file: TAbstractFile;
	changeType: VaultChangeType;
	oldPath?: string;
}>;

export const FFS_PLUGIN_SETTINGS = "FolderFileSplitterPlugin-Settings";
export const SettingsChangeEventName = "FFS-SettingsChangeEvent";

export const ActiveLeafChangeEventName = "FFS-ActiveLeafChangeEvent";
export type ActiveLeafChangeEvent = CustomEvent<{
	leaf: WorkspaceLeaf;
}>;

export const FFS_DRAG_FILE = "Drag_File";
export const FFS_SORT_FILE = "Sort_File";
export const FFS_DRAG_FOLDER = "Drag_Folder";
export const FFS_SORT_FOLDER = "Sort_Folder";
