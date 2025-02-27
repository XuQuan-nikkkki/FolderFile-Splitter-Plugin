export type expandFolderByClickingOnElement = "icon" | "folder";

export interface FolderFileSplitterPluginSettings {
	expandFolderByClickingOn: expandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
	showFileDetail: boolean;
}

export const DEFAULT_SETTINGS: FolderFileSplitterPluginSettings = {
	expandFolderByClickingOn: "icon",
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
	showFileDetail: true,
};
