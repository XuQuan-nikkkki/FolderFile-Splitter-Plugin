import { Plugin, TAbstractFile, WorkspaceLeaf } from "obsidian";

import {
	ActiveLeafChangeEventName,
	SettingsChangeEventName,
	VaultChangeEventName,
	VaultChangeType,
} from "./assets/constants";
import { ExplorerView } from "./ExplorerView";
import { Lang } from "./locales";
import { DEFAULT_SETTINGS, FolderFileSplitterPluginSettings } from "./settings";
import { SettingTab } from "./SettingTab";

export default class FolderFileSplitterPlugin extends Plugin {
	settings: FolderFileSplitterPluginSettings;
	language: Lang = "en";

	VIEW_TYPE = "ffs-plugin-file-tree-view";
	VIEW_DISPLAY_TEXT = "FolderFile Splitter";
	ICON = "dock";

	async onload() {
		console.log("FolderFile Splitter Plugin onload");

		if (document.documentElement.getAttribute("lang")?.startsWith("zh")) {
			this.language = "zh";
		}

		this.addSettingTab(new SettingTab(this.app, this));

		this.addRibbonIcon(this.ICON, this.VIEW_DISPLAY_TEXT, async () => {
			await this.openFileTreeLeaf(true);
		});

		this.registerView(
			this.VIEW_TYPE,
			(leaf) => new ExplorerView(leaf, this)
		);

		await this.loadSettings();

		this.addCommand({
			id: "open-file-tree-view",
			name: "Open file tree view",
			callback: async () => await this.openFileTreeLeaf(true),
		});

		if (this.settings.openPluginViewOnStartup) {
			this.app.workspace.onLayoutReady(async () => {
				await this.openFileTreeLeaf(true);
			});
		}

		this.app.vault.on("create", this.onCreate);
		this.app.vault.on("modify", this.onModify);
		this.app.vault.on("delete", this.onDelete);
		this.app.vault.on("rename", this.onRename);
		this.app.workspace.on("active-leaf-change", this.onChangeActiveLeaf);
	}

	triggerVaultChangeEvent = (
		file: TAbstractFile,
		changeType: VaultChangeType,
		oldPath?: string
	) => {
		const event = new CustomEvent(VaultChangeEventName, {
			detail: {
				file,
				changeType,
				oldPath,
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

	onRename: (file: TAbstractFile, oldPath: string) => void = (
		file,
		oldPath
	) => {
		this.triggerVaultChangeEvent(file, "rename", oldPath);
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

	triggerActiveLeafChangeEvent = (leaf: WorkspaceLeaf) => {
		const event = new CustomEvent(ActiveLeafChangeEventName, {
			detail: {
				leaf,
			},
		});
		window.dispatchEvent(event);
	};

	onChangeActiveLeaf: (leaf: WorkspaceLeaf) => void = (leaf) => {
		this.triggerActiveLeafChangeEvent(leaf);
	};

	onunload() {
		this.detachFileTreeLeafs();
		this.app.vault.off("create", this.onCreate);
		this.app.vault.off("modify", this.onModify);
		this.app.vault.off("delete", this.onDelete);
		this.app.vault.off("rename", this.onRename);
		this.app.workspace.off("active-leaf-change", this.onChangeActiveLeaf);
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
		const rawData = await this.loadData() ?? {};
		const filteredData = Object.fromEntries(
			Object.entries(rawData).filter(
				([key]) => key in DEFAULT_SETTINGS
			)
		);
		this.settings = Object.assign({}, DEFAULT_SETTINGS, filteredData);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	detachFileTreeLeafs = () => {
		const leafs = this.app.workspace.getLeavesOfType(this.VIEW_TYPE);
		for (const leaf of leafs) {
			(leaf.view as ExplorerView).destroy();
			leaf.detach();
		}
	};
}
