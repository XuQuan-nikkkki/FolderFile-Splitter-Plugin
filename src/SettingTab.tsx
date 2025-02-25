import { App, PluginSettingTab, Setting } from "obsidian";
import AppleStyleNotesPlugin from "./main";
import { expandFolderByClickingOnElement } from "./settings";
import { saveSettingsToLocalStorage } from "./utils";

export class SettingTab extends PluginSettingTab {
	plugin: AppleStyleNotesPlugin;

	constructor(app: App, plugin: AppleStyleNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async saveSettings() {
		await this.plugin.saveSettings();
		saveSettingsToLocalStorage(this.plugin.settings);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Show Folder Hierarchy Lines")
			.setDesc(
				"When enabled, a line will be displayed next to folders in the same hierarchy level under an expanded parent folder, visually indicating their nesting relationship."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFolderHierarchyLines);
				cb.onChange(async (val) => {
					this.plugin.settings.showFolderHierarchyLines = val;
					await this.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFolderHierarchyLines",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Show Folder Icon")
			.setDesc(
				"Enable this option to display icon next to folder, enhancing visual distinction between folders and files."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFolderIcon);
				cb.onChange(async (val) => {
					this.plugin.settings.showFolderIcon = val;
					await this.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFolderIcon",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Expand Folder on Click")
			.setDesc(
				"Choose whether to expand a folder by clicking on the toggle icon (▶/▼) or the folder name."
			)
			.addDropdown((cb) => {
				cb.addOption("icon", "Toggle Icon");
				cb.addOption("folder", "Folder Name");
				cb.setValue(this.plugin.settings.expandFolderByClickingOn);
				cb.onChange(async (val: expandFolderByClickingOnElement) => {
					this.plugin.settings.expandFolderByClickingOn = val;
					await this.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"expandFolderByClickingOn",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Include Subfolder Files Count")
			.setDesc(
				"When enabled, the file count will include files inside subfolders. Otherwise, only direct child files are counted."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.includeSubfolderFilesCount);
				cb.onChange(async (val) => {
					this.plugin.settings.includeSubfolderFilesCount = val;
					await this.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"includeSubfolderFilesCount",
						val
					);
				});
			});
	}
}
