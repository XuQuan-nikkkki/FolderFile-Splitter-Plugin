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

	_initToggleSetting<K extends SettingsKey>(settingKey: K) {
		this._initSetting(settingKey).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings[settingKey] as boolean);
			toggle.onChange(async (val) => {
				this._updateSetting(
					settingKey,
					val as FolderFileSplitterPluginSettings[K]
				);
			});
		});
	}

	display(): void {
		const { containerEl, headersCopy, settingsCopy } = this;

		containerEl.empty();

		this.createHeader2(headersCopy.startup);
		this._initToggleSetting("openPluginViewOnStartup");

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

		this._initToggleSetting("showFolderHierarchyLines");

		this._initToggleSetting("highlightActionBar");

		this._initToggleSetting("autoHideActionBar");

		this._initToggleSetting("showFolderIcon");

		this._initSetting("fileItemSpacing").addDropdown((dropdown) => {
			const { options } = settingsCopy.fileItemSpacing;
			dropdown.addOption(ComfortableSpacing, options?.comfortable ?? "");
			dropdown.addOption(CompactSpacing, options?.compact ?? "");
			dropdown.setValue(this.plugin.settings.fileItemSpacing);
			dropdown.onChange(async (val: FileItemSpacing) => {
				this._updateSetting("fileItemSpacing", val);
			});
		});

		this._initToggleSetting("showFileDetail");

		this._initToggleSetting("showFileCreationDate");

		this._initToggleSetting("showFileItemDivider");

		this.createHeader2(headersCopy.folderAndFileBehavior);
		this._initToggleSetting("hideRootFolder");

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

		this._initToggleSetting("includeSubfolderFilesCount");

		this._initToggleSetting("showFilesFromSubfolders");

		this._initToggleSetting("openDestinationFolderAfterMove");

		this.createHeader2(headersCopy.folderNoteSettings);
		this._initToggleSetting("autoOpenFolderNote");

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
