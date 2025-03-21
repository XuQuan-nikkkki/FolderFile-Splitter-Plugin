export const ExpandFolderByClickingIcon = "icon";
export const ExpandFolderByClickingFolder = "folder";

export type ExpandFolderByClickingOnElement =
	| typeof ExpandFolderByClickingIcon
	| typeof ExpandFolderByClickingFolder;

export const HorizontalSplitLayout = "Horizontal split";
export const VerticalSplitLayout = "Vertical split";
export const ToggleViewLayout = "Toggle view";
export type LayoutMode =
	| typeof HorizontalSplitLayout
	| typeof VerticalSplitLayout
	| typeof ToggleViewLayout;

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
	layoutMode: HorizontalSplitLayout,
};
