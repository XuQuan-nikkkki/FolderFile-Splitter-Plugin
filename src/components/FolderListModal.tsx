import { SuggestModal, TAbstractFile, TFolder } from "obsidian";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { FileTreeStore } from "src/store";
import { isFile, isFolder, moveFileOrFolder } from "src/utils";

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
		this.folders = [
			plugin.app.vault.getRoot(),
			...useFileTreeStore.getState().folders,
		];
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
		const { _removeFilePathFromOrder, _removeFolderPathFromOrder } =
			this.useFileTreeStore.getState();
		const removeFromOrder = isFile(this.item)
			? _removeFilePathFromOrder
			: _removeFolderPathFromOrder;
		try {
			await removeFromOrder(this.item);
			await moveFileOrFolder(this.app.fileManager, this.item, folder);
		} catch (e) {
			alert(e);
			console.error(e);
		}
	}
}
