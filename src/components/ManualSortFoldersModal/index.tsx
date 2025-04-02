import { Modal, TFolder } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";
import { TIPS_COPY } from "src/locales";

import ManualSortFolders from "./ManualSortFolders";

export class ManualSortFoldersModal extends Modal {
	folder: TFolder | null;
	useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>;
	plugin: FolderFileSplitterPlugin;
	root: Root;

	constructor(
		plugin: FolderFileSplitterPlugin,
		folder: TFolder,
		useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.folder = folder;
		this.useExplorerStore = useExplorerStore;
		this.setTitle(TIPS_COPY.dragToSortFolders[plugin.language]);
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
			<ManualSortFolders
				parentFolder={this.folder}
				useExplorerStore={this.useExplorerStore}
				plugin={this.plugin}
			/>
		);
	}
}
