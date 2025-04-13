import { App, PluginSettingTab, Setting } from "obsidian";
import FolderFileSplitterPlugin from "./main";
import {
	ComfortableSpacing,
	CompactSpacing,
	ExpandFolderByClickingOnElement,
	FileItemSpacing,
	HorizontalSplitLayoutMode,
	LayoutMode,
	VerticalSplitLayoutMode,
} from "./settings";
import {
	EN_SETTINGS,
	EN_SETTINGS_HEADER,
	ZH_SETTINGS,
	ZH_SETTINGS_HEADER,
} from "./locales/settings";

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

		const headersCopy =
			this.plugin.language === "zh"
				? ZH_SETTINGS_HEADER
				: EN_SETTINGS_HEADER;
		const settingsCopy =
			this.plugin.language === "zh" ? ZH_SETTINGS : EN_SETTINGS;

		this.createHeader(containerEl, headersCopy.startup);
		new Setting(containerEl)
			.setName(settingsCopy.openOnStartup.name)
			.setDesc(settingsCopy.openOnStartup.desc)
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

		this.createHeader(containerEl, headersCopy.layout);
		new Setting(containerEl)
			.setName(settingsCopy.layoutMode.name)
			.setDesc(settingsCopy.layoutMode.desc)
			.addDropdown((cb) => {
				const { options } = settingsCopy.layoutMode;
				cb.addOption(
					HorizontalSplitLayoutMode,
					options?.horizontalSplit ?? ""
				);
				cb.addOption(
					VerticalSplitLayoutMode,
					options?.verticalSplit ?? ""
				);
				cb.setValue(this.plugin.settings.layoutMode);
				cb.onChange(async (val: LayoutMode) => {
					this.plugin.settings.layoutMode = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent("layoutMode", val);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.showHierarchyLines.name)
			.setDesc(settingsCopy.showHierarchyLines.desc)
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
			.setName(settingsCopy.highlightActionBar.name)
			.setDesc(settingsCopy.highlightActionBar.desc)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.highlightActionBar);
				cb.onChange(async (val) => {
					this.plugin.settings.highlightActionBar = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"highlightActionBar",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.autoHideActionBar.name)
			.setDesc(settingsCopy.autoHideActionBar.desc)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.autoHideActionBar);
				cb.onChange(async (val) => {
					this.plugin.settings.autoHideActionBar= val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"autoHideActionBar",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.showFolderIcon.name)
			.setDesc(settingsCopy.showFolderIcon.desc)
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
			.setName(settingsCopy.fileItemSpacing.name)
			.setDesc(settingsCopy.fileItemSpacing.desc)
			.addDropdown((cb) => {
				const { options } = settingsCopy.fileItemSpacing;
				cb.addOption(ComfortableSpacing, options?.comfortable ?? "");
				cb.addOption(CompactSpacing, options?.compact ?? "");
				cb.setValue(this.plugin.settings.fileItemSpacing);
				cb.onChange(async (val: FileItemSpacing) => {
					this.plugin.settings.fileItemSpacing = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"fileItemSpacing",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.showFileDetail.name)
			.setDesc(settingsCopy.showFileDetail.desc)
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
			.setName(settingsCopy.showFileItemDivider.name)
			.setDesc(settingsCopy.showFileItemDivider.desc)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFileItemDivider);
				cb.onChange(async (val) => {
					this.plugin.settings.showFileItemDivider = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFileItemDivider",
						val
					);
				});
			});

		this.createHeader(containerEl, headersCopy.folderAndFileBehavior);
		new Setting(containerEl)
			.setName(settingsCopy.hideRootFolder.name)
			.setDesc(settingsCopy.hideRootFolder.desc)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.hideRootFolder);
				cb.onChange(async (val) => {
					this.plugin.settings.hideRootFolder = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"hideRootFolder",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.expandFolderOnClick.name)
			.setDesc(settingsCopy.expandFolderOnClick.desc)
			.addDropdown((cb) => {
				const { options } = settingsCopy.expandFolderOnClick;
				cb.addOption("icon", options?.icon ?? "");
				cb.addOption("folder", options?.folder ?? "");
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
			.setName(settingsCopy.includeSubfolderFilesCount.name)
			.setDesc(settingsCopy.includeSubfolderFilesCount.desc)
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

		new Setting(containerEl)
			.setName(settingsCopy.showFilesFromSubfolders.name)
			.setDesc(settingsCopy.showFilesFromSubfolders.desc)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showFilesFromSubfolders);
				cb.onChange(async (val) => {
					this.plugin.settings.showFilesFromSubfolders = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFilesFromSubfolders",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.openDestinationFolder.name)
			.setDesc(settingsCopy.openDestinationFolder.desc)
			.addToggle((cb) => {
				cb.setValue(
					this.plugin.settings.openDestinationFolderAfterMove
				);
				cb.onChange(async (val) => {
					this.plugin.settings.openDestinationFolderAfterMove = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"openDestinationFolderAfterMove",
						val
					);
				});
			});
	}
}
