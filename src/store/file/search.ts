import { TFile } from "obsidian";
import { StateCreator } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ValueOf } from "src/settings";

import { ExplorerStore } from "..";

export const SEARCH_SCOPE_TYPE = {
	FOLDER: "folder",
	TAG: "tag",
} as const;
export type SEARCH_SCOPE_TYPE = ValueOf<typeof SEARCH_SCOPE_TYPE>;
export type FolderSearchScope = {
	type: "folder";
	path: string;
};
export type TagSearchScope = {
	type: "tag";
	path: string;
};
export type SearchScope = FolderSearchScope | TagSearchScope;

export const SEARCH_FIELD = {
	TITLE_ONLY: "titleOnly",
	FULL_TEXT: "fullText",
} as const;
export type SearchField = ValueOf<typeof SEARCH_FIELD>;
export const DEFAULT_SEARCH_FIELD: SearchField = SEARCH_FIELD.FULL_TEXT;

export const DEFAULT_QUERY = "";

export interface SearchFileSlice {
	searchScope: SearchScope | null;
	searchField: SearchField;
	query: string;

	changeSearchField: (field: SearchField) => void;
	toggleSearchField: () => void;

	changeSearchScope: (scope: SearchScope) => void;
	clearSearchScope: () => void;

	changeQuery: (query: string) => void;
	clearQuery: () => void;

	searchResults: TFile[];
	updateSearchResults: (files: TFile[]) => void;
	searchByQuery: () => void;
}

export const createSearchFileSlice =
	(
		plugin: FolderFileSplitterPlugin
	): StateCreator<ExplorerStore, [], [], SearchFileSlice> =>
	(set, get) => ({
		searchScope: null,
		searchField: DEFAULT_SEARCH_FIELD,
		query: DEFAULT_QUERY,
		searchResults: [],

		changeSearchField: (field: SearchField) => {
			set({
				searchField: field,
			});
		},
		toggleSearchField: () => {
			const { changeSearchField, searchField } = get();
			const { FULL_TEXT, TITLE_ONLY } = SEARCH_FIELD;
			changeSearchField(
				searchField === TITLE_ONLY ? FULL_TEXT : TITLE_ONLY
			);
		},

		changeSearchScope: (scope: SearchScope) => {
			set({
				searchScope: scope,
			});
		},
		clearSearchScope: () => {
			set({
				searchScope: null,
			});
		},

		changeQuery: (query: string) => {
			set({
				query,
			});
		},
		clearQuery: () => {
			set({
				query: DEFAULT_QUERY,
			});
		},

		updateSearchResults: (files: TFile[]) => {
			set({
				searchResults: files,
			});
		},

		searchByQuery: () => {
			const {
				query,
				updateSearchResults,
				getFiles,
				searchScope,
				getTagsOfFile,
				getAncestors,
			} = get();
			const allFiles = getFiles();
			let filteredFiles = allFiles.filter((f) =>
				f.basename.toLowerCase().includes(query.trim().toLowerCase())
			);

			// TODO: support search content
			const { type, path } = searchScope ?? {};
			if (type === SEARCH_SCOPE_TYPE.FOLDER) {
				filteredFiles = filteredFiles.filter((f) => {
					const parentFolders = getAncestors(f);
					return parentFolders.some((f) => f.path === path);
				});
			} else if (type === SEARCH_SCOPE_TYPE.TAG) {
				filteredFiles = filteredFiles.filter((f) => {
					const tags = getTagsOfFile(f);
					return tags.some((t) => t.fullPath === path);
				});
			}
			updateSearchResults(filteredFiles);
		},
	});
