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

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	showFileDetail: boolean;
	openPluginViewOnStartup: boolean;
	layoutMode: LayoutMode;
	showFilesFromSubfolders: boolean;
	openDestinationFolderAfterMove: boolean;
}

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	expandFolderByClickingOn: ExpandFolderByClickingIcon,
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
	openPluginViewOnStartup: true,
	layoutMode: HorizontalSplitLayoutMode,
	showFilesFromSubfolders: false,
	openDestinationFolderAfterMove: false,
};
