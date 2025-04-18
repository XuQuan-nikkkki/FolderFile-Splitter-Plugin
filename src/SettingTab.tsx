import { App, PluginSettingTab, Setting } from "obsidian";
import FolderFileSplitterPlugin from "./main";
import {
	ComfortableSpacing,
	CompactSpacing,
	CustomLocationFile,
	ExpandFolderByClickingOnElement,
	FileItemSpacing,
	FOLDER_NOTE_MISSING_BEHAVIOR,
	FolderFileSplitterPluginSettings,
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

	async _updateSetting<K extends SettingsKey>(
		settingKey: K,
		value: FolderFileSplitterPluginSettings[K]
	) {
		this.plugin.settings[settingKey] = value;
		await this.plugin.saveSettings();
		this.plugin.triggerSettingsChangeEvent(settingKey, value);
	}

	display(): void {
		const { containerEl, headersCopy, settingsCopy } = this;

		containerEl.empty();

		this.createHeader2(headersCopy.startup);
		this._initSetting("openPluginViewOnStartup").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.openPluginViewOnStartup);
			toggle.onChange(async (val) => {
				this._updateSetting("openPluginViewOnStartup", val);
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
				this._updateSetting("layoutMode", val);
			});
		});

		this._initSetting("showFolderHierarchyLines").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFolderHierarchyLines);
			toggle.onChange(async (val) => {
				this._updateSetting("showFolderHierarchyLines", val);
			});
		});

		this._initSetting("highlightActionBar").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.highlightActionBar);
			toggle.onChange(async (val) => {
				this._updateSetting("highlightActionBar", val);
			});
		});

		this._initSetting("autoHideActionBar").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.autoHideActionBar);
			toggle.onChange(async (val) => {
				this._updateSetting("autoHideActionBar", val);
			});
		});

		this._initSetting("showFolderIcon").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFolderIcon);
			toggle.onChange(async (val) => {
				this._updateSetting("showFolderIcon", val);
			});
		});

		this._initSetting("fileItemSpacing").addDropdown((dropdown) => {
			const { options } = settingsCopy.fileItemSpacing;
			dropdown.addOption(ComfortableSpacing, options?.comfortable ?? "");
			dropdown.addOption(CompactSpacing, options?.compact ?? "");
			dropdown.setValue(this.plugin.settings.fileItemSpacing);
			dropdown.onChange(async (val: FileItemSpacing) => {
				this._updateSetting("fileItemSpacing", val);
			});
		});

		this._initSetting("showFileDetail").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFileDetail);
			toggle.onChange(async (val) => {
				this._updateSetting("showFileDetail", val);
			});
		});

		this._initSetting("showFileCreationDate").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFileCreationDate);
			toggle.onChange(async (val) => {
				this._updateSetting("showFileCreationDate", val);
			});
		});

		this._initSetting("showFileItemDivider").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFileItemDivider);
			toggle.onChange(async (val) => {
				this._updateSetting("showFileItemDivider", val);
			});
		});

		this.createHeader2(headersCopy.folderAndFileBehavior);
		this._initSetting("hideRootFolder").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.hideRootFolder);
			toggle.onChange(async (val) => {
				this._updateSetting("hideRootFolder", val);
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
						this._updateSetting("expandFolderByClickingOn", val);
					}
				);
			}
		);

		this._initSetting("includeSubfolderFilesCount").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.includeSubfolderFilesCount);
			toggle.onChange(async (val) => {
				this._updateSetting("includeSubfolderFilesCount", val);
			});
		});

		this._initSetting("showFilesFromSubfolders").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.showFilesFromSubfolders);
			toggle.onChange(async (val) => {
				this._updateSetting("showFilesFromSubfolders", val);
			});
		});

		this._initSetting("openDestinationFolderAfterMove").addToggle(
			(toggle) => {
				toggle.setValue(
					this.plugin.settings.openDestinationFolderAfterMove
				);
				toggle.onChange(async (val) => {
					this._updateSetting("openDestinationFolderAfterMove", val);
				});
			}
		);

		this.createHeader2(headersCopy.folderNoteSettings);
		this._initSetting("autoOpenFolderNote").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.autoOpenFolderNote);
			toggle.onChange(async (val) => {
				this._updateSetting("autoOpenFolderNote", val);
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
				this._updateSetting("folderNoteLocation", val);
			});
		});

		this._initSetting("customFolderNotePath").addText((text) => {
			text.setPlaceholder("{folder}/index.md")
				.setValue(this.plugin.settings.customFolderNotePath)
				.onChange(async (val: string) => {
					this._updateSetting("customFolderNotePath", val);
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
					this._updateSetting("folderNoteMissingBehavior", val);
				});
			}
		);
	}
}
