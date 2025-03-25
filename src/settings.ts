export const ExpandFolderByClickingIcon = "icon";
export const ExpandFolderByClickingFolder = "folder";

export type ExpandFolderByClickingOnElement =
	| typeof ExpandFolderByClickingIcon
	| typeof ExpandFolderByClickingFolder;

export const HorizontalSplitLayoutMode = "Horizontal split";
export const VerticalSplitLayoutMode = "Vertical split";
export const ToggleViewLayoutMode = "Toggle view";
export type LayoutMode =
	| typeof HorizontalSplitLayoutMode
	| typeof VerticalSplitLayoutMode
	| typeof ToggleViewLayoutMode;

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	showFileDetail: boolean;
	openPluginViewOnStartup: boolean;
	layoutMode: LayoutMode;
}

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	expandFolderByClickingOn: ExpandFolderByClickingIcon,
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
	openPluginViewOnStartup: true,
	layoutMode: HorizontalSplitLayoutMode,
};
