export type ValueOf<T> = T[keyof T];

export const EXPAND_NODE_ON_CLICK = {
	ICON: "icon",
	LABEL: "label",
	SELECTED_LABEL: "selected_label",
} as const;
export type ExpandNodeOnClick = ValueOf<typeof EXPAND_NODE_ON_CLICK>;

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

export type StartupSettings = {
	openPluginViewOnStartup: boolean;
};
export type LayoutSettings = {
	layoutMode: LayoutMode;
	showViewModeDisplay: boolean;
	highlightActionBar: boolean;
	autoHideActionBar: boolean;
};
export type FolderAndTagBehaviorSettings = {
	showFolderHierarchyLines: boolean;
	showFilesCount: boolean;
	expandNodeOnClick: ExpandNodeOnClick;
	openDestinationFolderAfterMove: boolean;
	revealFileInExplorer: boolean;
};
export type FolderSettings = {
	hideRootFolder: boolean;
	showFolderView: boolean;
	showFolderIcon: boolean;
	includeSubfolderFiles: boolean;
};
export type TagSettings = {
	showTagView: boolean;
	showTagIcon: boolean;
	includeSubTagFiles: boolean;
	deduplicateTagFiles: boolean;
};
export type FileDetailSettings = {
	showFileDetail: boolean;
	stripMarkdownSyntaxInPreview: boolean;
	removeFirstHeadingInPreview: boolean;
	showFileCreationDate: boolean;
	fileCreationDateFormat: string;
};
export type FileDisplaySettings = {
	boldFileTitle: boolean;
	fileItemSpacing: FileItemSpacing;
	showFileItemDivider: boolean;
};
export type FolderNoteSettings = {
	autoOpenFolderNote: boolean;
	folderNoteLocation: FolderNoteLocation;
	customFolderNotePath: string;
	folderNoteMissingBehavior: FolderNoteMissingBehavior;
};
export type FolderFileSplitterPluginSettings = StartupSettings &
	LayoutSettings &
	FolderAndTagBehaviorSettings &
	FolderSettings &
	TagSettings &
	FileDetailSettings &
	FileDisplaySettings &
	FolderNoteSettings;

export const STARTUP_SETTINGS: StartupSettings = {
	openPluginViewOnStartup: true,
};

export const LAYOUT_SETTINGS: LayoutSettings = {
	layoutMode: LAYOUT_MODE.HORIZONTAL_SPLIT,
	showViewModeDisplay: true,
	highlightActionBar: false,
	autoHideActionBar: false,
};

export const FOLDER_AND_TAG_BEHAVIOR_SETTINGS: FolderAndTagBehaviorSettings = {
	showFolderHierarchyLines: false,
	showFilesCount: true,
	expandNodeOnClick: EXPAND_NODE_ON_CLICK.SELECTED_LABEL,
	openDestinationFolderAfterMove: false,
	revealFileInExplorer: false,
};

export const FOLDER_SETTINGS: FolderSettings = {
	hideRootFolder: false,
	showFolderView: true,
	showFolderIcon: true,
	includeSubfolderFiles: false,
};

export const TAG_SETTINGS: TagSettings = {
	showTagView: false,
	showTagIcon: true,
	includeSubTagFiles: false,
	deduplicateTagFiles: true,
};

export const FILE_DETAIL_SETTINGS: FileDetailSettings = {
	showFileDetail: true,
	stripMarkdownSyntaxInPreview: false,
	removeFirstHeadingInPreview: false,
	showFileCreationDate: true,
	fileCreationDateFormat: DEFAULT_FILE_CREATION_DATE_FORMAT,
};

export const FILE_DISPLAY_SETTINGS: FileDisplaySettings = {
	boldFileTitle: true,
	fileItemSpacing: FILE_ITEM_SPACING.COMFORTABLE,
	showFileItemDivider: true,
};

export const FOLDER_NOTE_SETTINGS: FolderNoteSettings = {
	autoOpenFolderNote: false,
	folderNoteLocation: FOLDER_NOTE_LOCATION.INDEX_FILE,
	customFolderNotePath: "",
	folderNoteMissingBehavior: FOLDER_NOTE_MISSING_BEHAVIOR.IGNORE,
};

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	...STARTUP_SETTINGS,
	...LAYOUT_SETTINGS,
	...FOLDER_AND_TAG_BEHAVIOR_SETTINGS,
	...FOLDER_SETTINGS,
	...TAG_SETTINGS,
	...FILE_DETAIL_SETTINGS,
	...FILE_DISPLAY_SETTINGS,
	...FOLDER_NOTE_SETTINGS,
};

// legacy constant and type
const EXPAND_FOLDER_BY_CLICKING_ELEMENT = {
	ICON: "icon",
	FOLDER: "folder",
} as const;
export type ExpandFolderByClickingOnElement = ValueOf<
	typeof EXPAND_FOLDER_BY_CLICKING_ELEMENT
>;

export type LegacySettings = {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
};
export const LEGACY_SETTINGS = {
	expandFolderByClickingOn: EXPAND_FOLDER_BY_CLICKING_ELEMENT.FOLDER,
};

export type AllSettings = FolderFileSplitterPluginSettings & LegacySettings;
