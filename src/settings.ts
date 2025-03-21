export type ExpandFolderByClickingOnElement = "icon" | "folder";
export type LayoutMode = "Horizontal split" | "Vertical split" | "Toggle view";

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
	expandFolderByClickingOn: "icon",
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
	openPluginViewOnStartup: true,
	layoutMode: "Horizontal split",
};
