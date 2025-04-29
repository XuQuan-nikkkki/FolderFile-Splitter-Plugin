type ValueOf<T> = T[keyof T];

export const EXPAND_FOLDER_BY_CLICKING_ELEMENT = {
	ICON: "icon",
	FOLDER: "folder",
} as const;
export type ExpandFolderByClickingOnElement = ValueOf<
	typeof EXPAND_FOLDER_BY_CLICKING_ELEMENT
>;

export const LAYOUT_MODE = {
	HORIZONTAL_SPLIT: "Horizontal split",
	VERTICAL_SPLIT: "Vertical split",
} as const;
export type LayoutMode = ValueOf<typeof LAYOUT_MODE>;

export const FILE_ITEM_SPACING = {
	COMPACT: "Compact",
	COMFORTABLE: "Comfortable",
};
export type FileItemSpacing = ValueOf<typeof FILE_ITEM_SPACING>;

export const FOLDER_NOTE_LOCATION = {
	INDEX_FILE: "index.md",
	UNDERSCORE_FILE: "_folder.md",
	FOLDER_NAME_FILE: "folderName",
	CUSTOM_LOCATION_FILE: "custom",
};
export type FolderNoteLocation = ValueOf<typeof FOLDER_NOTE_LOCATION>;

export const FOLDER_NOTE_MISSING_BEHAVIOR = {
	IGNORE: "ignore",
	WARN: "warn",
	CREATE: "create",
} as const;
export type FolderNoteMissingBehavior = ValueOf<
	typeof FOLDER_NOTE_MISSING_BEHAVIOR
>;

export const DEFAULT_FILE_CREATION_DATE_FORMAT = "YYYY/MM/DD";

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	boldFileTitle: boolean;
	showFileDetail: boolean;
	removeFirstHeadingInPreview: boolean;
	fileCreationDateFormat: string;
	showFileCreationDate: boolean;
	showFileItemDivider: boolean;
	stripMarkdownSyntaxInPreview: boolean;
	fileItemSpacing: FileItemSpacing;
	highlightActionBar: boolean;
	autoHideActionBar: boolean;
	openPluginViewOnStartup: boolean;
	layoutMode: LayoutMode;
	showFilesFromSubfolders: boolean;
	openDestinationFolderAfterMove: boolean;
	hideRootFolder: boolean;
	autoOpenFolderNote: boolean;
	folderNoteLocation: FolderNoteLocation;
	customFolderNotePath: string;
	folderNoteMissingBehavior: FolderNoteMissingBehavior;
}

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	expandFolderByClickingOn: EXPAND_FOLDER_BY_CLICKING_ELEMENT.FOLDER,
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	boldFileTitle: true,
	showFileDetail: true,
	stripMarkdownSyntaxInPreview: false,
	removeFirstHeadingInPreview: false,
	showFileCreationDate: true,
	fileCreationDateFormat: DEFAULT_FILE_CREATION_DATE_FORMAT,
	fileItemSpacing: FILE_ITEM_SPACING.COMFORTABLE,
	showFileItemDivider: true,
	highlightActionBar: false,
	autoHideActionBar: false,
	openPluginViewOnStartup: true,
	layoutMode: LAYOUT_MODE.HORIZONTAL_SPLIT,
	showFilesFromSubfolders: false,
	openDestinationFolderAfterMove: false,
	hideRootFolder: false,
	autoOpenFolderNote: false,
	folderNoteLocation: FOLDER_NOTE_LOCATION.INDEX_FILE,
	customFolderNotePath: "",
	folderNoteMissingBehavior: FOLDER_NOTE_MISSING_BEHAVIOR.IGNORE,
};
