import { Modal, TFolder } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import FolderFileSplitterPlugin from "src/main";
import ManualSortFiles from "./ManualSortFiles";
import { FileTreeStore } from "src/store";
import { StoreApi, UseBoundStore } from "zustand";
import { TIPS_COPY } from "src/locales";

export class ManualSortFilesModal extends Modal {
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
		this.setTitle(TIPS_COPY.dragToSortFiles[plugin.language]);
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
			<ManualSortFiles
				parentFolder={this.folder}
				useFileTreeStore={this.useFileTreeStore}
				plugin={this.plugin}
			/>
		);
	}
}
