import { Root, createRoot } from "react-dom/client";
import { ItemView, WorkspaceLeaf } from "obsidian";

import FolderFileSplitterPlugin from "./main";
import FileTree from "./components/FileTree";

export class FileTreeView extends ItemView {
	root: Root;
	plugin: FolderFileSplitterPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: FolderFileSplitterPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return this.plugin?.VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.plugin?.VIEW_DISPLAY_TEXT;
	}

	getIcon(): string {
		return this.plugin?.ICON;
	}

	destroy() {
		this.root?.unmount();
	}

	async onOpen(): Promise<void> {
		this.destroy();
		this.constructFileTree(this.app.vault.getRoot().path, "");
	}

	constructFileTree(folderPath: string, vaultChange: string) {
		this.destroy();
		this.root = createRoot(this.contentEl);
		this.root.render(
			<div className="ffs-plugin-view">
				<FileTree plugin={this.plugin} />
			</div>
		);
	}
}
