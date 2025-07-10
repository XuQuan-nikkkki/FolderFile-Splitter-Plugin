import dayjs from "dayjs";
import { App, DropdownComponent, PluginSettingTab, Setting } from "obsidian";

import {
	EN_SETTINGS_HEADER,
	SettingOptions,
	SETTINGS_COPY,
	SettingsKey,
	ZH_SETTINGS_HEADER,
} from "./locales/settings";
import FolderFileSplitterPlugin from "./main";
import { FolderFileSplitterPluginSettings } from "./settings";

export class SettingTab extends PluginSettingTab {
	plugin: FolderFileSplitterPlugin;

	constructor(app: App, plugin: FolderFileSplitterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	splitEmojiFromText(text: string): { emoji: string; text: string } {
		const emojiRegex =
			/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})+/u;
		const match = text.match(emojiRegex);

		return {
			emoji: match ? match[0] : "",
			text: match ? text.slice(match[0].length).trim() : text,
		};
	}

	createHeader2(textContent: string) {
		const index = Object.values(this.headersCopy).indexOf(textContent);
		if (index < 0) {
			console.error("Header does not exist");
		}
		const { emoji, text } = this.splitEmojiFromText(textContent);

		const header = this.containerEl.createEl("h2");
		header.textContent = `${emoji} ${index + 1}. ${text}`;
		header.style.marginBottom = "8px";
	}

	get headersCopy() {
		return this.plugin.language === "zh"
			? ZH_SETTINGS_HEADER
			: EN_SETTINGS_HEADER;
	}

	_initSetting(settingKey: SettingsKey) {
		return new Setting(this.containerEl)
			.setName(SETTINGS_COPY[settingKey][this.plugin.language].name)
			.setDesc(SETTINGS_COPY[settingKey][this.plugin.language].desc);
	}

	_initToggleSetting<K extends SettingsKey>(settingKey: K) {
		this._initSetting(settingKey).addToggle((toggle) => {
			toggle.setValue(this.plugin.settings[settingKey] as boolean);
			toggle.onChange(async (val) => {
				this.plugin.changeSetting(
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
		const { options = [] } =
			SETTINGS_COPY[settingKey][this.plugin.language];
		this._initSetting(settingKey).addDropdown((dropdown) => {
			this._initDropdownOptions(dropdown, options);
			dropdown.setValue(this.plugin.settings[settingKey] as string);
			dropdown.onChange(async (val) => {
				this.plugin.changeSetting(
					settingKey,
					val as FolderFileSplitterPluginSettings[K]
				);
			});
		});
	}

	_initTextSetting<K extends SettingsKey>(
		settingKey: K,
		placeholder?: string
	) {
		this._initSetting(settingKey).addText((text) => {
			if (placeholder) {
				text.setPlaceholder(placeholder);
			}
			text.setValue(this.plugin.settings[settingKey] as string);
			text.onChange(async (val) => {
				this.plugin.changeSetting(
					settingKey,
					val as FolderFileSplitterPluginSettings[K]
				);
			});
		});
	}

	initStartupSettings() {
		this.createHeader2(this.headersCopy.startup);
		this._initToggleSetting("openPluginViewOnStartup");
	}

	initLayoutSettings() {
		this.createHeader2(this.headersCopy.layout);
		this._initDropdownSetting("layoutMode");
		this._initToggleSetting("highlightActionBar");
		this._initToggleSetting("autoHideActionBar");
	}

	initFolderAndFileBehaviorSettings() {
		this.createHeader2(this.headersCopy.folderAndTagBehavior);
		this._initToggleSetting("showFolderHierarchyLines");
		this._initToggleSetting("showFilesCount");
		this._initToggleSetting("openDestinationFolderAfterMove");
		this._initToggleSetting("revealFileInExplorer");
	}

	initFolderSettings() {
		this.createHeader2(this.headersCopy.folderSettings);
		this._initToggleSetting("hideRootFolder");
		this._initToggleSetting("showFolderView");
		this._initToggleSetting("showFolderIcon");
		this._initToggleSetting("includeSubfolderFiles");
	}

	initTagSettings() {
		this.createHeader2(this.headersCopy.tagSettings);
		this._initToggleSetting("showTagView");
		this._initToggleSetting("showTagIcon");
		this._initToggleSetting("includeSubTagFiles");
	}

	generateFileCreationDateFormatDesc(setting: Setting, format: string) {
		const { plugin } = this;
		const { language } = plugin;
		const fragment = document.createDocumentFragment();
		fragment.append(SETTINGS_COPY.fileCreationDateFormat[language].desc);

		const anchor = document.createElement("a");
		const link =
			language === "zh"
				? "https://day.js.org/docs/zh-CN/display/format"
				: "https://day.js.org/docs/en/display/format";
		anchor.href = link;
		anchor.textContent = link;
		anchor.target = "_blank";
		anchor.rel = "noopener";
		fragment.append(anchor);

		const previewTips =
			language === "zh" ? "当前格式预览：" : "Current preview: ";
		const preview = dayjs(1730650047220).format(format);
		fragment.append(" (" + previewTips + preview + ")");
		setting.setDesc(fragment);
	}

	_initFileCreationDateFormatSetting() {
		const { containerEl, plugin } = this;
		const { settings, language } = plugin;
		const setting = new Setting(containerEl).setName(
			SETTINGS_COPY.fileCreationDateFormat[language].name
		);

		this.generateFileCreationDateFormatDesc(
			setting,
			settings.fileCreationDateFormat
		);

		setting.addText((text) => {
			text.setValue(this.plugin.settings.fileCreationDateFormat);
			text.onChange(async (val) => {
				this.plugin.changeSetting("fileCreationDateFormat", val);
				this.generateFileCreationDateFormatDesc(setting, val);
			});
		});
	}

	initFileDetailSettings() {
		this.createHeader2(this.headersCopy.fileDetail);
		this._initToggleSetting("showFileDetail");
		this._initToggleSetting("stripMarkdownSyntaxInPreview");
		this._initToggleSetting("removeFirstHeadingInPreview");
		this._initToggleSetting("showFileCreationDate");
		this._initFileCreationDateFormatSetting();
	}

	initFileDisplaySettings() {
		this.createHeader2(this.headersCopy.fileDisplay);
		this._initToggleSetting("boldFileTitle");
		this._initDropdownSetting("fileItemSpacing");
		this._initToggleSetting("showFileItemDivider");
	}

	initFolderNoteSettings() {
		this.createHeader2(this.headersCopy.folderNoteSettings);
		this._initToggleSetting("autoOpenFolderNote");
		this._initDropdownSetting("folderNoteLocation");
		this._initTextSetting("customFolderNotePath", "{folder}/index.md");
		this._initDropdownSetting("folderNoteMissingBehavior");
	}

	display(): void {
		this.containerEl.empty();
		this.initStartupSettings();
		this.initLayoutSettings();
		this.initFolderAndFileBehaviorSettings();
		this.initFolderSettings();
		this.initTagSettings();
		this.initFileDetailSettings();
		this.initFileDisplaySettings();
		this.initFolderNoteSettings();
	}
}
