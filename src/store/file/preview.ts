import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";

import { ExplorerStore } from "..";

export type PreviewSignature = string;

const makePreviewKey = (path: string, signature: PreviewSignature) =>
	`${path}::${signature}`;

export interface PreviewFileSlice {
	fileRawCache: Map<string, string>;
	filePreviewCache: Map<string, string>;

	/** 兼容旧 API：仅按 file.path 判断是否有 *默认签名* 的缓存（不推荐新代码用） */
	hasCachedFilePreview: (
		file: TFile,
		signature?: PreviewSignature
	) => boolean;

	setFilePreview: (
		file: TFile,
		preview: string,
		signature?: PreviewSignature
	) => void;
	getFilePreview: (
		file: TFile,
		signature?: PreviewSignature
	) => string | undefined;

	setFileRaw: (file: TFile, raw: string) => void;
	getFileRaw: (file: TFile) => string | undefined;

	clearAllPreviews: () => void;
	clearPreviewsByPath: (path: string) => void;
	clearRawByPath: (path: string) => void;
}

export const createPreviewFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], PreviewFileSlice> =>
	(set, get) => ({
		fileRawCache: new Map(),
		filePreviewCache: new Map(),

		hasCachedFilePreview: (
			file: TFile,
			signature: PreviewSignature = ""
		) => {
			const key = signature
				? makePreviewKey(file.path, signature)
				: file.path;
			const cache = get().filePreviewCache;
			// 兼容老数据：老版本保存的是 file.path 作为 key
			return cache.has(key) || (!signature && cache.has(file.path));
		},

		setFilePreview: (
			file: TFile,
			preview: string,
			signature: PreviewSignature = ""
		) => {
			const cache = get().filePreviewCache;
			const key = signature
				? makePreviewKey(file.path, signature)
				: file.path;
			cache.set(key, preview);
			set({ filePreviewCache: cache });
		},

		getFilePreview: (file: TFile, signature: PreviewSignature = "") => {
			const cache = get().filePreviewCache;
			const key = signature
				? makePreviewKey(file.path, signature)
				: file.path;
			return (
				cache.get(key) ??
				(!signature ? cache.get(file.path) : undefined)
			);
		},

		setFileRaw: (file: TFile, raw: string) => {
			const cache = get().fileRawCache;
			cache.set(file.path, raw);
			set({ fileRawCache: cache });
		},

		getFileRaw: (file: TFile) => {
			return get().fileRawCache.get(file.path);
		},

		clearAllPreviews: () => {
			const preview = get().filePreviewCache;
			if (preview.size === 0) return;
			preview.clear();
			set({ filePreviewCache: preview });
		},

		clearPreviewsByPath: (path: string) => {
			const preview = get().filePreviewCache;
			if (preview.size === 0) return;
			preview.delete(path);
			const prefix = `${path}::`;
			for (const key of preview.keys()) {
				if (key.startsWith(prefix)) preview.delete(key);
			}
			set({ filePreviewCache: preview });
		},

		clearRawByPath: (path: string) => {
			const raw = get().fileRawCache;
			if (!raw.has(path)) return;
			raw.delete(path);
			set({ fileRawCache: raw });
		},
	});
