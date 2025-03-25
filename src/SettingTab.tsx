import { App, PluginSettingTab, Setting } from "obsidian";
import FolderFileSplitterPlugin from "./main";
import {
	ExpandFolderByClickingOnElement,
	HorizontalSplitLayoutMode,
	LayoutMode,
	ToggleViewLayoutMode,
	VerticalSplitLayoutMode,
} from "./settings";

export class SettingTab extends PluginSettingTab {
	plugin: FolderFileSplitterPlugin;

	constructor(app: App, plugin: FolderFileSplitterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	createHeader(containerEl: HTMLElement, textContent: string) {
		const header = containerEl.createEl("h2");
		header.textContent = textContent;
		header.style.marginBottom = "8px";
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.createHeader(containerEl, "🔷 Startup");
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

		this.createHeader(containerEl, "🧭 Layout");
		new Setting(containerEl)
			.setName("Layout mode")
			.setDesc(
				"Choose how to display folders and files in the plugin view. You can arrange them side-by-side, stacked vertically, or use a toggle view that switches between folders and files."
			)
			.addDropdown((cb) => {
				cb.addOption(HorizontalSplitLayoutMode, "Horizontal split");
				cb.addOption(VerticalSplitLayoutMode, "Vertical split");
				cb.addOption(ToggleViewLayoutMode, "Toggle view");
				cb.setValue(this.plugin.settings.layoutMode);
				cb.onChange(async (val: LayoutMode) => {
					this.plugin.settings.layoutMode = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent("layoutMode", val);
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

		this.createHeader(containerEl, "📁 Folder & File Behavior");
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
