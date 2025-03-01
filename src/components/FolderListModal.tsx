import { SuggestModal, TAbstractFile, TFolder } from "obsidian";
import FolderFileSplitterPlugin from "src/main";
import { moveFileOrFolder } from "src/utils";

export class FolderListModal extends SuggestModal<TFolder> {
	folders: TFolder[];
	item: TAbstractFile;

	constructor(
		plugin: FolderFileSplitterPlugin,
		folders: TFolder[],
		item: TAbstractFile
	) {
		super(plugin.app);
		this.folders = [plugin.app.vault.getRoot(), ...folders];
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

	onChooseSuggestion(folder: TFolder, evt: MouseEvent | KeyboardEvent) {
		moveFileOrFolder(this.app.fileManager, this.item, folder);
	}
}
