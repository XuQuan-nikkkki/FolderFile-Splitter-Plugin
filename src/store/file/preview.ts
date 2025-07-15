import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export interface PreviewFileSlice {
	filePreviewCache: Map<string, string>;

	hasCachedFilePreview: (file: TFile) => boolean;

	setFilePreview: (file: TFile, preview: string) => void;
	getFilePreview: (file: TFile) => string | undefined;
}

export const createPreviewFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PreviewFileSlice> =>
	(set, get) => ({
		filePreviewCache: new Map(),

		hasCachedFilePreview: (file: TFile) => {
			return get().filePreviewCache.has(file.path);
		},

		setFilePreview: (file: TFile, preview: string) => {
			const cache = new Map(get().filePreviewCache);
			cache.set(file.path, preview);
			set({ filePreviewCache: cache });
		},

		getFilePreview: (file: TFile) => {
			return get().filePreviewCache.get(file.path);
		},
	});
