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
	SettingsKey,
	ZH_SETTINGS,
	ZH_SETTINGS_HEADER,
} from "./locales/settings";

export class SettingTab extends PluginSettingTab {
	plugin: FolderFileSplitterPlugin;

	constructor(app: App, plugin: FolderFileSplitterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	createHeader2(textContent: string) {
		const header = this.containerEl.createEl("h2");
		header.textContent = textContent;
		header.style.marginBottom = "8px";
	}

	createHeader3(textContent: string) {
		const header = this.containerEl.createEl("h3");
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

	_initSetting(settingKey: SettingsKey) {
		const { settingsCopy } = this;
		return new Setting(this.containerEl)
			.setName(settingsCopy[settingKey].name)
			.setDesc(settingsCopy[settingKey].desc);
	}

	display(): void {
		const { containerEl, headersCopy, settingsCopy } = this;

		containerEl.empty();

		this.createHeader2(headersCopy.startup);
		this._initSetting("openPluginViewOnStartup").addToggle((toggle) => {
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

		this.createHeader2(headersCopy.layout);
		this._initSetting("layoutMode").addDropdown((dropdown) => {
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

		this._initSetting("showFolderHierarchyLines").addToggle((toggle) => {
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

		this._initSetting("highlightActionBar").addToggle((toggle) => {
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

		this._initSetting("autoHideActionBar").addToggle((toggle) => {
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

		this._initSetting("showFolderIcon").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFolderIcon);
			toggle.onChange(async (val) => {
				this.plugin.settings.showFolderIcon = val;
				await this.plugin.saveSettings();
				this.plugin.triggerSettingsChangeEvent("showFolderIcon", val);
			});
		});

		this._initSetting("fileItemSpacing").addDropdown((dropdown) => {
			const { options } = settingsCopy.fileItemSpacing;
			dropdown.addOption(ComfortableSpacing, options?.comfortable ?? "");
			dropdown.addOption(CompactSpacing, options?.compact ?? "");
			dropdown.setValue(this.plugin.settings.fileItemSpacing);
			dropdown.onChange(async (val: FileItemSpacing) => {
				this.plugin.settings.fileItemSpacing = val;
				await this.plugin.saveSettings();
				this.plugin.triggerSettingsChangeEvent("fileItemSpacing", val);
			});
		});

		this._initSetting("showFileDetail").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFileDetail);
			toggle.onChange(async (val) => {
				this.plugin.settings.showFileDetail = val;
				await this.plugin.saveSettings();
				this.plugin.triggerSettingsChangeEvent("showFileDetail", val);
			});
		});

		this._initSetting("showFileCreationDate").addToggle((toggle) => {
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

		this._initSetting("showFileItemDivider").addToggle((toggle) => {
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

		this.createHeader2(headersCopy.folderAndFileBehavior);
		this._initSetting("hideRootFolder").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.hideRootFolder);
			toggle.onChange(async (val) => {
				this.plugin.settings.hideRootFolder = val;
				await this.plugin.saveSettings();
				this.plugin.triggerSettingsChangeEvent("hideRootFolder", val);
			});
		});

		this._initSetting("expandFolderByClickingOn").addDropdown(
			(dropdown) => {
				const { options } = settingsCopy.expandFolderByClickingOn;
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
			}
		);

		this._initSetting("includeSubfolderFilesCount").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.includeSubfolderFilesCount);
			toggle.onChange(async (val) => {
				this.plugin.settings.includeSubfolderFilesCount = val;
				await this.plugin.saveSettings();
				this.plugin.triggerSettingsChangeEvent(
					"includeSubfolderFilesCount",
					val
				);
			});
		});

		this._initSetting("showFilesFromSubfolders").addToggle((toggle) => {
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

		this._initSetting("openDestinationFolderAfterMove").addToggle(
			(toggle) => {
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
			}
		);

		this.createHeader2(headersCopy.folderNoteSettings);
		this._initSetting("autoOpenFolderNote").addToggle((toggle) => {
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

		this._initSetting("folderNoteLocation").addDropdown((dropdown) => {
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

		this._initSetting("customFolderNotePath").addText((text) => {
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

		this._initSetting("folderNoteMissingBehavior").addDropdown(
			(dropdown) => {
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
			}
		);
	}
}
