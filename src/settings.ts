export type expandFolderByClickingOnElement = "icon" | "folder";

export interface AppleStyleNotesPluginSettings {
	expandFolderByClickingOn: expandFolderByClickingOnElement;
	includeSubfolderFilesCount: boolean;
	showFolderHierarchyLines: boolean;
	showFolderIcon: boolean;
}

export const DEFAULT_SETTINGS: AppleStyleNotesPluginSettings = {
	expandFolderByClickingOn: "icon",
	includeSubfolderFilesCount: false,
	showFolderHierarchyLines: false,
	showFolderIcon: true,
};
