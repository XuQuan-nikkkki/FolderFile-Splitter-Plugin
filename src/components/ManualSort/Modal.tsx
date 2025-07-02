import {  Modal, TFolder } from "obsidian";
import { ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";

export abstract class ManualSortModal extends Modal {
	protected folder: TFolder;
	protected useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>;
	protected plugin: FolderFileSplitterPlugin;
	private root: Root;

	constructor(
		plugin: FolderFileSplitterPlugin,
		useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>,
		folder: TFolder = plugin.app.vault.getRoot()
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.folder = folder;
		this.useExplorerStore = useExplorerStore;
		this.setTitle(this.getTitle());
	}

	abstract getTitle(): string;
	abstract renderReact(): ReactNode;

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
		this.root.render(this.renderReact());
	}
}
