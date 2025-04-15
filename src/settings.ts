export const ExpandFolderByClickingIcon = "icon";
export const ExpandFolderByClickingFolder = "folder";

export type ExpandFolderByClickingOnElement =
	| typeof ExpandFolderByClickingIcon
	| typeof ExpandFolderByClickingFolder;

export const HorizontalSplitLayoutMode = "Horizontal split";
export const VerticalSplitLayoutMode = "Vertical split";
export type LayoutMode =
	| typeof HorizontalSplitLayoutMode
	| typeof VerticalSplitLayoutMode;

export const CompactSpacing = "Compact";
export const ComfortableSpacing = "Comfortable";
export type FileItemSpacing = typeof CompactSpacing | typeof ComfortableSpacing;

export const IndexFile = "index.md";
export const UnderscoreFile = "_folder.md";
export const FolderNameFile = "folderName";
export const CustomLocationFile = "custom";
export type FolderNoteLocation =
	| typeof IndexFile
	| typeof UnderscoreFile
	| typeof FolderNameFile
	| typeof CustomLocationFile;

export const FOLDER_NOTE_MISSING_BEHAVIOR = {
	IGNORE: "ignore",
	WARN: "warn",
	CREATE: "create",
} as const;
export type FolderNoteMissingBehavior =
	(typeof FOLDER_NOTE_MISSING_BEHAVIOR)[keyof typeof FOLDER_NOTE_MISSING_BEHAVIOR];

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	showFileDetail: boolean;
	showFileCreationDate: boolean;
	showFileItemDivider: boolean;
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
	expandFolderByClickingOn: ExpandFolderByClickingIcon,
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
	showFileCreationDate: true,
	fileItemSpacing: ComfortableSpacing,
	showFileItemDivider: true,
	highlightActionBar: false,
	autoHideActionBar: false,
	openPluginViewOnStartup: true,
	layoutMode: HorizontalSplitLayoutMode,
	showFilesFromSubfolders: false,
	openDestinationFolderAfterMove: false,
	hideRootFolder: false,
	autoOpenFolderNote: false,
	folderNoteLocation: IndexFile,
	customFolderNotePath: "",
	folderNoteMissingBehavior: FOLDER_NOTE_MISSING_BEHAVIOR.IGNORE,
};
