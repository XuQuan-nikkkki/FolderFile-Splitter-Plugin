export type ExpandFolderByClickingOnElement = "icon" | "folder";

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: ExpandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	showFileDetail: boolean;
	openPluginViewOnStartup: boolean;
}

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	expandFolderByClickingOn: "icon",
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
	openPluginViewOnStartup: true,
};
