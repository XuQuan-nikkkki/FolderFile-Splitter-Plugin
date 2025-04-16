import { App, PluginSettingTab, Setting } from "obsidian";
import FolderFileSplitterPlugin from "./main";
import {
	ComfortableSpacing,
	CompactSpacing,
	CustomLocationFile,
	ExpandFolderByClickingOnElement,
	FileItemSpacing,
	FOLDER_NOTE_MISSING_BEHAVIOR,
	FolderNameFile,
	FolderNoteLocation,
	FolderNoteMissingBehavior,
	HorizontalSplitLayoutMode,
	IndexFile,
	LayoutMode,
	UnderscoreFile,
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

	createHeader2(containerEl: HTMLElement, textContent: string) {
		const header = containerEl.createEl("h2");
		header.textContent = textContent;
		header.style.marginBottom = "8px";
	}

	createHeader3(containerEl: HTMLElement, textContent: string) {
		const header = containerEl.createEl("h3");
		header.textContent = textContent;
		header.style.marginBottom = "4px";
	}

	get headersCopy() {
		return this.plugin.language === "zh"
			? ZH_SETTINGS_HEADER
			: EN_SETTINGS_HEADER;
	}

	get settingsCopy() {
		return this.plugin.language === "zh" ? ZH_SETTINGS : EN_SETTINGS;
	}

	display(): void {
		const { containerEl, headersCopy, settingsCopy } = this;

		containerEl.empty();

		this.createHeader2(containerEl, headersCopy.startup);
		new Setting(containerEl)
			.setName(settingsCopy.openOnStartup.name)
			.setDesc(settingsCopy.openOnStartup.desc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.openPluginViewOnStartup);
				toggle.onChange(async (val) => {
					this.plugin.settings.openPluginViewOnStartup = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"openPluginViewOnStartup",
						val
					);
				});
			});

		this.createHeader2(containerEl, headersCopy.layout);
		new Setting(containerEl)
			.setName(settingsCopy.layoutMode.name)
			.setDesc(settingsCopy.layoutMode.desc)
			.addDropdown((dropdown) => {
				const { options } = settingsCopy.layoutMode;
				dropdown.addOption(
					HorizontalSplitLayoutMode,
					options?.horizontalSplit ?? ""
				);
				dropdown.addOption(
					VerticalSplitLayoutMode,
					options?.verticalSplit ?? ""
				);
				dropdown.setValue(this.plugin.settings.layoutMode);
				dropdown.onChange(async (val: LayoutMode) => {
					this.plugin.settings.layoutMode = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent("layoutMode", val);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.showHierarchyLines.name)
			.setDesc(settingsCopy.showHierarchyLines.desc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showFolderHierarchyLines);
				toggle.onChange(async (val) => {
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
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.highlightActionBar);
				toggle.onChange(async (val) => {
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
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.autoHideActionBar);
				toggle.onChange(async (val) => {
					this.plugin.settings.autoHideActionBar = val;
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
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showFolderIcon);
				toggle.onChange(async (val) => {
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
			.addDropdown((dropdown) => {
				const { options } = settingsCopy.fileItemSpacing;
				dropdown.addOption(
					ComfortableSpacing,
					options?.comfortable ?? ""
				);
				dropdown.addOption(CompactSpacing, options?.compact ?? "");
				dropdown.setValue(this.plugin.settings.fileItemSpacing);
				dropdown.onChange(async (val: FileItemSpacing) => {
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
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showFileDetail);
				toggle.onChange(async (val) => {
					this.plugin.settings.showFileDetail = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFileDetail",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.showFileCreationDate.name)
			.setDesc(settingsCopy.showFileCreationDate.desc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showFileCreationDate);
				toggle.onChange(async (val) => {
					this.plugin.settings.showFileCreationDate = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFileCreationDate",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.showFileItemDivider.name)
			.setDesc(settingsCopy.showFileItemDivider.desc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showFileItemDivider);
				toggle.onChange(async (val) => {
					this.plugin.settings.showFileItemDivider = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"showFileItemDivider",
						val
					);
				});
			});

		this.createHeader2(containerEl, headersCopy.folderAndFileBehavior);
		new Setting(containerEl)
			.setName(settingsCopy.hideRootFolder.name)
			.setDesc(settingsCopy.hideRootFolder.desc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.hideRootFolder);
				toggle.onChange(async (val) => {
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
			.addDropdown((dropdown) => {
				const { options } = settingsCopy.expandFolderOnClick;
				dropdown.addOption("icon", options?.icon ?? "");
				dropdown.addOption("folder", options?.folder ?? "");
				dropdown.setValue(
					this.plugin.settings.expandFolderByClickingOn
				);
				dropdown.onChange(
					async (val: ExpandFolderByClickingOnElement) => {
						this.plugin.settings.expandFolderByClickingOn = val;
						await this.plugin.saveSettings();
						this.plugin.triggerSettingsChangeEvent(
							"expandFolderByClickingOn",
							val
						);
					}
				);
			});

		new Setting(containerEl)
			.setName(settingsCopy.includeSubfolderFilesCount.name)
			.setDesc(settingsCopy.includeSubfolderFilesCount.desc)
			.addToggle((toggle) => {
				toggle.setValue(
					this.plugin.settings.includeSubfolderFilesCount
				);
				toggle.onChange(async (val) => {
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
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showFilesFromSubfolders);
				toggle.onChange(async (val) => {
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
			.addToggle((toggle) => {
				toggle.setValue(
					this.plugin.settings.openDestinationFolderAfterMove
				);
				toggle.onChange(async (val) => {
					this.plugin.settings.openDestinationFolderAfterMove = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"openDestinationFolderAfterMove",
						val
					);
				});
			});

		this.createHeader2(containerEl, headersCopy.folderNoteSettings);
		new Setting(containerEl)
			.setName(settingsCopy.autoOpenFolderNote.name)
			.setDesc(settingsCopy.autoOpenFolderNote.desc)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.autoOpenFolderNote);
				toggle.onChange(async (val) => {
					this.plugin.settings.autoOpenFolderNote = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"autoOpenFolderNote",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.folderNoteLocation.name)
			.setDesc(settingsCopy.folderNoteLocation.desc)
			.addDropdown((dropdown) => {
				const { options } = settingsCopy.folderNoteLocation;
				dropdown.addOption(IndexFile, options?.index ?? "");
				dropdown.addOption(UnderscoreFile, options?.underscore ?? "");
				dropdown.addOption(FolderNameFile, options?.folderName ?? "");
				dropdown.addOption(
					CustomLocationFile,
					options?.customLocation ?? ""
				);
				dropdown.setValue(this.plugin.settings.folderNoteLocation);
				dropdown.onChange(async (val: FolderNoteLocation) => {
					this.plugin.settings.folderNoteLocation = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"folderNoteLocation",
						val
					);
				});
			});

		new Setting(containerEl)
			.setName(settingsCopy.customFolderNotePath.name)
			.setDesc(settingsCopy.customFolderNotePath.desc)
			.addText((text) => {
				text.setPlaceholder("{folder}/index.md")
					.setValue(this.plugin.settings.customFolderNotePath)
					.onChange(async (val: string) => {
						this.plugin.settings.customFolderNotePath = val;
						await this.plugin.saveSettings();
						this.plugin.triggerSettingsChangeEvent(
							"customFolderNotePath",
							val
						);
					});
			});

		new Setting(containerEl)
			.setName(settingsCopy.folderNoteMissingBehavior.name)
			.setDesc(settingsCopy.folderNoteMissingBehavior.desc)
			.addDropdown((dropdown) => {
				const { options } = settingsCopy.folderNoteMissingBehavior;
				const { IGNORE, WARN, CREATE } = FOLDER_NOTE_MISSING_BEHAVIOR;
				dropdown.addOption(IGNORE, options?.ignore ?? "");
				dropdown.addOption(WARN, options?.warn ?? "");
				dropdown.addOption(CREATE, options?.create ?? "");
				dropdown.setValue(
					this.plugin.settings.folderNoteMissingBehavior
				);
				dropdown.onChange(async (val: FolderNoteMissingBehavior) => {
					this.plugin.settings.folderNoteMissingBehavior = val;
					await this.plugin.saveSettings();
					this.plugin.triggerSettingsChangeEvent(
						"folderNoteMissingBehavior",
						val
					);
				});
			});
	}
}
