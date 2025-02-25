import { Plugin, TAbstractFile } from "obsidian";

import { FileTreeView } from "./FileTreeView";
import { SettingTab } from "./SettingTab";
import { DEFAULT_SETTINGS, FolderFileSplitterPluginSettings } from "./settings";
import {
	SettingsChangeEventName,
	VaultChangeEventName,
	VaultChangeType,
} from "./assets/constants";

export default class FolderFileSplitterPlugin extends Plugin {
	settings: FolderFileSplitterPluginSettings;

	VIEW_TYPE = "ffs-plugin-file-tree-view";
	VIEW_DISPLAY_TEXT = "FolderFile Splitter Plugin File Tree";
	ICON = "dock";

	async onload() {
		console.log("FolderFile Splitter Plugin onload");

		this.addSettingTab(new SettingTab(this.app, this));

		this.registerView(
			this.VIEW_TYPE,
			(leaf) => new FileTreeView(leaf, this)
		);

		await this.loadSettings();

		this.addCommand({
			id: "open-file-tree-view",
			name: "Open file tree view",
			callback: async () => await this.openFileTreeLeaf(true),
		});

		this.app.workspace.onLayoutReady(async () => {
			await this.openFileTreeLeaf(true);
		});

		this.app.vault.on("create", this.onCreate);
		this.app.vault.on("modify", this.onModify);
		this.app.vault.on("delete", this.onDelete);
		this.app.vault.on("rename", this.onRename);
	}

	triggerVaultChangeEvent = (
		file: TAbstractFile,
		changeType: VaultChangeType
	) => {
		const event = new CustomEvent(VaultChangeEventName, {
			detail: {
				file,
				changeType,
			},
		});
		window.dispatchEvent(event);
	};

	onCreate: (file: TAbstractFile) => void = (file) => {
		this.triggerVaultChangeEvent(file, "create");
	};

	onModify: (file: TAbstractFile) => void = (file) => {
		this.triggerVaultChangeEvent(file, "modify");
	};

	onDelete: (file: TAbstractFile) => void = (file) => {
		this.triggerVaultChangeEvent(file, "delete");
	};

	onRename: (file: TAbstractFile) => void = (file) => {
		this.triggerVaultChangeEvent(file, "rename");
	};

	triggerSettingsChangeEvent = <
		K extends keyof FolderFileSplitterPluginSettings
	>(
		changeKey: K,
		changeValue: FolderFileSplitterPluginSettings[K]
	) => {
		const event = new CustomEvent(SettingsChangeEventName, {
			detail: {
				changeKey,
				changeValue,
			},
		});
		window.dispatchEvent(event);
	};

	onunload() {
		this.app.vault.off("create", this.onCreate);
		this.app.vault.off("modify", this.onModify);
		this.app.vault.off("delete", this.onDelete);
		this.app.vault.off("rename", this.onRename);
	}

	openFileTreeLeaf = async (showAfterAttach: boolean) => {
		const leafs = this.app.workspace.getLeavesOfType(this.VIEW_TYPE);
		if (leafs.length == 0) {
			const leaf = this.app.workspace.getLeftLeaf(false);
			if (!leaf) return;
			await leaf.setViewState({ type: this.VIEW_TYPE });
			if (showAfterAttach) this.app.workspace.revealLeaf(leaf);
		} else {
			if (showAfterAttach) {
				leafs.forEach((leaf) => this.app.workspace.revealLeaf(leaf));
			}
		}
	};

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
