import {
	CachedMetadata,
	Plugin,
	TAbstractFile,
	TFile,
	WorkspaceLeaf,
} from "obsidian";

import {
	ActiveLeafChangeEventName,
	MetadataCacheChangeEventName,
	SettingsChangeEventName,
	VaultChangeEventName,
	VaultChangeType,
} from "./assets/constants";
import { ExplorerView } from "./ExplorerView";
import { Lang } from "./locales";
import {
	AllSettings,
	DEFAULT_SETTINGS,
	ExpandFolderByClickingOnElement,
	ExpandNodeOnClick,
	FolderFileSplitterPluginSettings,
} from "./settings";
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
		this.app.metadataCache.on("changed", this.onChangeMetadataCache);
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

	triggerMetadataCacheChangeEvent = (
		file: TAbstractFile,
		data: string,
		cache: CachedMetadata
	) => {
		const event = new CustomEvent(MetadataCacheChangeEventName, {
			detail: {
				file,
				data,
				cache,
			},
		});
		window.dispatchEvent(event);
	};

	private lastHandledFiles = new Set<string>();

	onChangeMetadataCache: (
		file: TFile,
		data: string,
		cache: CachedMetadata
	) => void = (file, data, cache) => {
		if (this.lastHandledFiles.has(file.path)) return;
		this.lastHandledFiles.add(file.path);

		this.triggerMetadataCacheChangeEvent(file, data, cache);

		setTimeout(() => this.lastHandledFiles.delete(file.path), 500);
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
		console.log("Unloading FolderFile Splitter...");
		this.detachFileTreeLeafs();
		this.app.vault.off("create", this.onCreate);
		this.app.vault.off("modify", this.onModify);
		this.app.vault.off("delete", this.onDelete);
		this.app.vault.off("rename", this.onRename);
		this.app.workspace.off("active-leaf-change", this.onChangeActiveLeaf);
		this.app.metadataCache.off("changed", this.onChangeMetadataCache);
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

	migrateLegacySettings(raw: Partial<AllSettings>): Partial<AllSettings> {
		const updated = { ...raw };

		const legacyExpandNodeOnClick = raw.expandFolderByClickingOn;
		if (legacyExpandNodeOnClick && !raw.expandNodeOnClick) {
			const valueMap: Record<
				ExpandFolderByClickingOnElement,
				ExpandNodeOnClick
			> = {
				icon: "icon",
				folder: "selected_label",
			};

			updated.expandNodeOnClick = valueMap[legacyExpandNodeOnClick];
		}

		return updated;
	}

	removeLegacySettings(
		raw: Partial<AllSettings>
	): FolderFileSplitterPluginSettings {
		return Object.fromEntries(
			Object.entries(raw).filter(([key]) => key in DEFAULT_SETTINGS)
		) as FolderFileSplitterPluginSettings;
	}

	async loadSettings() {
		const rawData = (await this.loadData()) ?? {};
		const migratedData = this.migrateLegacySettings(rawData);
		const filteredData = this.removeLegacySettings(migratedData);
		this.settings = Object.assign({}, DEFAULT_SETTINGS, filteredData);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async changeSetting<K extends keyof FolderFileSplitterPluginSettings>(
		key: K,
		value: FolderFileSplitterPluginSettings[K]
	) {
		this.settings[key] = value;
		await this.saveSettings();
		this.triggerSettingsChangeEvent(key, value);
	}

	detachFileTreeLeafs = () => {
		const leafs = this.app.workspace.getLeavesOfType(this.VIEW_TYPE);
		for (const leaf of leafs) {
			(leaf.view as ExplorerView).destroy();
			leaf.detach();
		}
	};
}
