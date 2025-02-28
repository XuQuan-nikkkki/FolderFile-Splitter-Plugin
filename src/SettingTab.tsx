import { App, PluginSettingTab, Setting } from "obsidian";
import FolderFileSplitterPlugin from "./main";
import { ExpandFolderByClickingOnElement } from "./settings";

export class SettingTab extends PluginSettingTab {
	plugin: FolderFileSplitterPlugin;

	constructor(app: App, plugin: FolderFileSplitterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Open plugin view on startup")
			.setDesc(
				"When enabled, the plugin view will be opened automatically when Obsidian starts."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.openPluginViewOnStartup);
				cb.onChange(async (val) => {
					this.plugin.settings.openPluginViewOnStartup = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"openPluginViewOnStartup",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Show file detail")
			.setDesc(
				"When enabled, file details such as creation time and a content preview will be displayed below the file name."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFileDetail);
				cb.onChange(async (val) => {
					this.plugin.settings.showFileDetail = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFileDetail",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Show folder hierarchy lines")
			.setDesc(
				"When enabled, a line will be displayed next to folders in the same hierarchy level under an expanded parent folder, visually indicating their nesting relationship."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFolderHierarchyLines);
				cb.onChange(async (val) => {
					this.plugin.settings.showFolderHierarchyLines = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFolderHierarchyLines",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Show folder icon")
			.setDesc(
				"Enable this option to display icon next to folder, enhancing visual distinction between folders and files."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFolderIcon);
				cb.onChange(async (val) => {
					this.plugin.settings.showFolderIcon = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFolderIcon",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Expand folder on click")
			.setDesc(
				"Choose whether to expand a folder by clicking on the toggle icon (▶/▼) or the folder name."
			)
			.addDropdown((cb) => {
				cb.addOption("icon", "Toggle Icon");
				cb.addOption("folder", "Folder Name");
				cb.setValue(this.plugin.settings.expandFolderByClickingOn);
				cb.onChange(async (val: ExpandFolderByClickingOnElement) => {
					this.plugin.settings.expandFolderByClickingOn = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"expandFolderByClickingOn",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName("Include subfolder files count")
			.setDesc(
				"When enabled, the file count will include files inside subfolders. Otherwise, only direct child files are counted."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.includeSubfolderFilesCount);
				cb.onChange(async (val) => {
					this.plugin.settings.includeSubfolderFilesCount = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"includeSubfolderFilesCount",
						val
					);
				});
			});
	}
}
