import { SuggestModal, TAbstractFile, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import {
	FILE_MANUAL_SORT_RULE,
	FileTreeStore,
	FOLDER_MANUAL_SORT_RULE,
} from "src/store";
import { isFile } from "src/utils";

export class FolderListModal extends SuggestModal<TFolder> {
	folders: TFolder[];
	item: TAbstractFile;
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;

	constructor(
		plugin: FolderFileSplitterPlugin,
		useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>,
		item: TAbstractFile
	) {
		super(plugin.app);
		this.useFileTreeStore = useFileTreeStore;
		this.folders = plugin.app.vault.getAllFolders(true);
		this.item = item;
		this.setPlaceholder("Type a folder");
		this.setInstructions([
			{ command: "↑↓", purpose: "to navigate" },
			{ command: "↵", purpose: "to move" },
			{ command: "esc", purpose: "to dismiss" },
		]);
	}

	getSuggestions(query: string): TFolder[] {
		return this.folders.filter((folder) =>
			folder.path.toLowerCase().includes(query.toLowerCase())
		);
	}

	renderSuggestion(folder: TFolder, el: HTMLElement) {
		el.createEl("div", {
			text: folder.isRoot() ? this.app.vault.getName() : folder.path,
		});
	}

	async onChooseSuggestion(folder: TFolder) {
		const {
			moveFile,
			moveFolder,
			folderSortRule,
			initFoldersManualSortOrder,
		} = this.useFileTreeStore.getState();
		try {
			const newPath = folder.path + "/" + this.item.name;
			if (isFile(this.item)) {
				await moveFile(this.item, newPath);
			} else {
				await moveFolder(this.item as TFolder, newPath);
				if (folderSortRule !== FOLDER_MANUAL_SORT_RULE) return;
				await initFoldersManualSortOrder();
			}
		} catch (e) {
			alert(e);
			console.error(e);
		}
	}
}
