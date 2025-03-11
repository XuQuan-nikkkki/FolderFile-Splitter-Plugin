import { Modal, TFolder } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import FolderFileSplitterPlugin from "src/main";
import ManualSort from "./ManualSort";
import { FileTreeStore } from "src/store";
import { StoreApi, UseBoundStore } from "zustand";

export class ManualSortFoldersModal extends Modal {
	folder: TFolder | null;
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	plugin: FolderFileSplitterPlugin;
	root: Root;

	constructor(
		plugin: FolderFileSplitterPlugin,
		folder: TFolder,
		useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.folder = folder;
		this.useFileTreeStore = useFileTreeStore;
		this.setTitle("Drag to sort folders:");
	}

	destroy() {
		this.root?.unmount();
	}

	async onOpen(): Promise<void> {
		this.destroy();
		this.renderContent();
	}

	onClose() {
		this.destroy();
	}

	renderContent() {
		this.destroy();
		this.root = createRoot(this.contentEl);
		this.root.render(
			<ManualSort
				parentFolder={this.folder}
				useFileTreeStore={this.useFileTreeStore}
				plugin={this.plugin}
			/>
		);
	}
}
