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

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	showFileDetail: boolean;
	showFileItemDivider: boolean;
	fileItemSpacing: FileItemSpacing;
	openPluginViewOnStartup: boolean;
	layoutMode: LayoutMode;
	showFilesFromSubfolders: boolean;
	openDestinationFolderAfterMove: boolean;
	hideRootFolder: boolean;
}

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	expandFolderByClickingOn: ExpandFolderByClickingIcon,
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
	fileItemSpacing: ComfortableSpacing,
	showFileItemDivider: true,
	openPluginViewOnStartup: true,
	layoutMode: HorizontalSplitLayoutMode,
	showFilesFromSubfolders: false,
	openDestinationFolderAfterMove: false,
	hideRootFolder: false,
};
