import { App, DropdownComponent, PluginSettingTab, Setting } from "obsidian";
import FolderFileSplitterPlugin from "./main";
import { FolderFileSplitterPluginSettings } from "./settings";
import {
	EN_SETTINGS,
	EN_SETTINGS_HEADER,
	SettingOptions,
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

	_initDropdownOptions(
		dropdown: DropdownComponent,
		options: SettingOptions[]
	) {
		options.forEach((option) => {
			const { value, text } = option;
			dropdown.addOption(value, text);
		});
	}

	_initDropdownSetting<K extends SettingsKey>(settingKey: K) {
		const { options = [] } = this.settingsCopy[settingKey];
		this._initSetting(settingKey).addDropdown((dropdown) => {
			this._initDropdownOptions(dropdown, options);
			dropdown.setValue(this.plugin.settings[settingKey] as string);
			dropdown.onChange(async (val) => {
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
		this._initDropdownSetting("layoutMode");

		this._initToggleSetting("showFolderHierarchyLines");

		this._initToggleSetting("highlightActionBar");

		this._initToggleSetting("autoHideActionBar");

		this._initToggleSetting("showFolderIcon");

		this._initDropdownSetting("fileItemSpacing");

		this._initToggleSetting("showFileDetail");

		this._initToggleSetting("showFileCreationDate");

		this._initToggleSetting("showFileItemDivider");

		this.createHeader2(headersCopy.folderAndFileBehavior);
		this._initToggleSetting("hideRootFolder");

		this._initDropdownSetting("expandFolderByClickingOn");

		this._initToggleSetting("includeSubfolderFilesCount");

		this._initToggleSetting("showFilesFromSubfolders");

		this._initToggleSetting("openDestinationFolderAfterMove");

		this.createHeader2(headersCopy.folderNoteSettings);
		this._initToggleSetting("autoOpenFolderNote");

		this._initDropdownSetting("folderNoteLocation");

		this._initSetting("customFolderNotePath").addText((text) => {
			text.setPlaceholder("{folder}/index.md")
				.setValue(this.plugin.settings.customFolderNotePath)
				.onChange(async (val: string) => {
					this._updateSetting("customFolderNotePath", val);
				});
		});

		this._initDropdownSetting("folderNoteMissingBehavior");
	}
}
