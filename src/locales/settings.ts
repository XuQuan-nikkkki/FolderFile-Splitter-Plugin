import {
	EXPAND_NODE_ON_CLICK,
	FILE_ITEM_SPACING,
	FileDetailSettings,
	FileDisplaySettings,
	FOLDER_NOTE_LOCATION,
	FOLDER_NOTE_MISSING_BEHAVIOR,
	FolderAndTagBehaviorSettings,
	FolderFileSplitterPluginSettings,
	FolderNoteSettings,
	FolderSettings,
	LAYOUT_MODE,
	LayoutSettings,
	StartupSettings,
	TagSettings,
} from "src/settings";

export interface SettingsHeaderLocaleResource {
	[key: string]: string;
}

export const EN_SETTINGS_HEADER: SettingsHeaderLocaleResource = {
	startup: "🔷 Startup",
	layout: "🧭 Layout",
	folderAndTagBehavior: "🧾 Folder and tag behavior",
	folderSettings: "📂 Folder settings",
	tagSettings: "🏷️ Tag settings",
	fileDetail: "📄 File Detail",
	fileDisplay: "🧷 File Display",
	folderNoteSettings: "🗂️ Folder note settings",
};
export const ZH_SETTINGS_HEADER: SettingsHeaderLocaleResource = {
	startup: "🔷 启动与布局",
	layout: "🧭 布局样式",
	folderAndTagBehavior: "🧾 文件夹和标签行为",
	folderSettings: "📂 文件夹设置",
	tagSettings: "🏷️ 标签设置",
	fileDetail: "📄 文件详情",
	fileDisplay: "🧷 文件显示",
	folderNoteSettings: "🗂️ Folder note 设置",
};

export type SettingsKey = keyof FolderFileSplitterPluginSettings;
export type SettingOptions = {
	value: string;
	text: string;
};

type LocaleResource = {
	name: string;
	desc: string;
	options?: SettingOptions[];
};
export type SettingsLocaleResource<T> = {
	[key in keyof T]: {
		en: LocaleResource;
		zh: LocaleResource;
	};
};

export const STARTUP_SETTINGS_COPY: SettingsLocaleResource<StartupSettings> = {
	openPluginViewOnStartup: {
		en: {
			name: "Open plugin view on startup",
			desc: "When enabled, the plugin view will be opened automatically when Obsidian starts.",
		},
		zh: {
			name: "启动时自动打开插件视图",
			desc: "启用后，Obsidian 启动时会自动打开插件视图。",
		},
	},
};

export const LAYOUT_SETTINGS_COPY: SettingsLocaleResource<LayoutSettings> = {
	layoutMode: {
		en: {
			name: "Layout mode",
			desc: "Choose how to display folders and files in the plugin view. You can arrange them side-by-side, stacked vertically, or use a toggle view that switches between folders and files.",
			options: [
				{
					value: LAYOUT_MODE.HORIZONTAL_SPLIT,
					text: "Horizontal split",
				},
				{
					value: LAYOUT_MODE.VERTICAL_SPLIT,
					text: "Vertical split",
				},
			],
		},
		zh: {
			name: "布局模式",
			desc: "选择插件视图中文件夹和文件的显示方式：水平分割（文件夹和文件两列并排）、垂直分割（文件夹和文件列垂直堆叠），或切换视图（通过切换视图在两者间转换）。",
			options: [
				{
					value: LAYOUT_MODE.HORIZONTAL_SPLIT,
					text: "水平分割",
				},
				{
					value: LAYOUT_MODE.VERTICAL_SPLIT,
					text: "垂直分割",
				},
			],
		},
	},
	showViewModeDisplay: {
		en: {
			name: "Show view context",
			desc: "When enabled, a label will be displayed above the file list to indicate the current view mode, such as the selected folder, tag, or 'All files'.",
		},
		zh: {
			name: "显示视图上下文",
			desc: "启用后，会在文件列表上方显示当前视图的上下文信息，例如选中的文件夹、标签，或“全部文件”等提示。",
		},
	},
	highlightActionBar: {
		en: {
			name: "Highlight action bar",
			desc: "When enabled, the top action buttons will have a background and margin to distinguish them from surrounding elements.",
		},
		zh: {
			name: "高亮操作栏",
			desc: "启用后，顶部操作按钮区域将添加背景色和边距，以增强与周围内容的区分。",
		},
	},
	autoHideActionBar: {
		en: {
			name: "Auto-hide action bar",
			desc: "When enabled, the top action bar will be hidden by default and only appear when hovering over it.",
		},
		zh: {
			name: "自动隐藏操作栏",
			desc: "启用后，顶部操作栏默认隐藏，鼠标悬停时才会显示。",
		},
	},
	autoScrollToCenter: {
		en: {
			name: "Auto scroll selected item into center",
			desc: "When enabled, clicking a folder, tag, or file will automatically scroll the selected item into the center of the view. Disable this to prevent automatic repositioning.",
		},
		zh: {
			name: "自动滚动到视图中心",
			desc: "启用后，在文件夹、标签或文件列表中点击项目时，会自动将该项目滚动到视图中间。关闭此选项可禁止该自动滚动行为。",
		},
	},
};

export const FOLDER_AND_TAG_BEHAVIOR_SETTINGS_COPY: SettingsLocaleResource<FolderAndTagBehaviorSettings> =
	{
		showFolderHierarchyLines: {
			en: {
				name: "Show hierarchy lines",
				desc: "When enabled, a line will be displayed next to folders/tags in the same hierarchy level under an expanded parent folder/tag, visually indicating their nesting relationship.",
			},
			zh: {
				name: "显示层级线",
				desc: "启用后，展开的父文件夹/标签下会显示同级文件夹/标签的层级线，直观展示嵌套关系。",
			},
		},
		showFilesCount: {
			en: {
				name: "Show files count",
				desc: "Display the number of files next to each folder or tag. The count will appear on the right side of the item name.",
			},
			zh: {
				name: "显示文件数量",
				desc: "在每个文件夹或标签名称右侧显示包含的文件数量。",
			},
		},
		expandNodeOnClick: {
			en: {
				name: "Expand node on click",
				desc: "Control how folders or tags expand when clicked: only when clicking the icon, or also when clicking the label (with optional selection behavior).",
				options: [
					{
						value: EXPAND_NODE_ON_CLICK.ICON,
						text: "Toggle icon only",
					},
					{
						value: EXPAND_NODE_ON_CLICK.LABEL,
						text: "Click label to expand and select",
					},
					{
						value: EXPAND_NODE_ON_CLICK.SELECTED_LABEL,
						text: "Click once to select, click again to expand",
					},
				],
			},
			zh: {
				name: "点击展开节点",
				desc: "设置点击文件夹或标签时的展开方式：仅点击图标展开，点击标签名时直接展开并选中，或点击一次选中、再次点击展开。",
				options: [
					{
						value: EXPAND_NODE_ON_CLICK.ICON,
						text: "仅点击图标",
					},
					{
						value: EXPAND_NODE_ON_CLICK.LABEL,
						text: "点击文件夹/标签名展开并选中",
					},
					{
						value: EXPAND_NODE_ON_CLICK.SELECTED_LABEL,
						text: "第一次点击选中，再次点击展开",
					},
				],
			},
		},
		openDestinationFolderAfterMove: {
			en: {
				name: "Open destination folder after move",
				desc: "When enabled, the destination folder will automatically open after moving a file or folder.",
			},
			zh: {
				name: "移动后打开目标文件夹",
				desc: "启用后，在移动文件或文件夹后，目标文件夹将自动展开并显示。",
			},
		},
		revealFileInExplorer: {
			en: {
				name: "Reveal file in file explorer",
				desc: "When enabled, the selected file will be automatically revealed in plugin's file explorer when switching between files.",
			},
			zh: {
				name: "在文件管理器中定位文件",
				desc: "启用后，切换文件时会自动在插件的文件管理器中定位该文件。",
			},
		},
	};

export const FOLDER_SETTINGS_COPY: SettingsLocaleResource<FolderSettings> = {
	hideRootFolder: {
		en: {
			name: "Hide root folder",
			desc: "When enabled, the root folder will be hidden from the folder view. Only its subfolders will be shown.",
		},
		zh: {
			name: "隐藏根文件夹",
			desc: "启用后，文件夹视图中将隐藏根文件夹，只显示其子文件夹。",
		},
	},
	showFolderView: {
		en: {
			name: "Show folder view",
			desc: "Display files by folder. Can be used together with tag view.",
		},
		zh: {
			name: "显示文件夹视图",
			desc: "按文件夹显示文件。可以与标签视图一起使用。",
		},
	},
	showFolderIcon: {
		en: {
			name: "Show folder icon",
			desc: "Display an icon next to folders to improve visual clarity and structure.",
		},
		zh: {
			name: "显示文件夹图标",
			desc: "启用后，文件夹旁会显示图标，以增强视觉层级感和结构清晰度。",
		},
	},
	includeSubfolderFiles: {
		en: {
			name: "Include subfolder files",
			desc: "When enabled, files inside subfolders will be included in the file list and their count will be reflected in the folder’s file count.",
		},
		zh: {
			name: "包含子文件夹文件",
			desc: "启用后，子文件夹中的文件将会显示在文件列表中，并计入所属文件夹的文件数量。",
		},
	},
};

export const TAG_SETTINGS_COPY: SettingsLocaleResource<TagSettings> = {
	showTagView: {
		en: {
			name: "Show tag view",
			desc: "Display files by tag. Can be used together with folder view.",
		},
		zh: {
			name: "显示标签视图",
			desc: "按标签显示文件。可以与文件夹视图一起使用。",
		},
	},
	showTagIcon: {
		en: {
			name: "Show tag icon",
			desc: "Display an icon next to tags to improve visual clarity and structure.",
		},
		zh: {
			name: "显示标签图标",
			desc: "启用后，标签旁会显示图标，以增强视觉层级感和结构清晰度。",
		},
	},
	includeSubTagFiles: {
		en: {
			name: "Include subtag files",
			desc: "When enabled, files inside subtags will be included in the file list and their count will be reflected in the tag file count.",
		},
		zh: {
			name: "包含子标签文件",
			desc: "启用后，子标签中的文件将会显示在文件列表中，并计入所属标签的文件数量。",
		},
	},
	deduplicateTagFiles: {
		en: {
			name: "Deduplicate files in tag view",
			desc: "When enabled, files that appear under multiple sub-tags will only be shown once when viewing a parent tag. Note: the total file count may still include duplicates.",
		},
		zh: {
			name: "标签视图去重文件",
			desc: "启用后，在查看父标签时，若文件同时属于多个子标签，只会显示一次。但文件数量统计仍会包含重复项。",
		},
	},
};

export const FILE_DETAIL_SETTINGS_COPY: SettingsLocaleResource<FileDetailSettings> =
	{
		showFileDetail: {
			en: {
				name: "Show file detail",
				desc: "When enabled, file details such as creation time and a content preview will be displayed below the file name.",
			},
			zh: {
				name: "显示文件详情",
				desc: "启用后，文件名下方会显示创建时间和内容预览等详细信息。",
			},
		},
		stripMarkdownSyntaxInPreview: {
			en: {
				name: "Strip Markdown syntax in preview",
				desc: "When enabled, Markdown formatting symbols will be removed from the file content preview (e.g., `**bold**` → `bold`, `### heading` → `heading`).",
			},
			zh: {
				name: "预览中隐藏 Markdown 符号",
				desc: "启用后，文件内容预览中的 Markdown 格式符号将被移除（例如：`**加粗**` → `加粗`， `### 标题` → `标题`）。",
			},
		},
		removeFirstHeadingInPreview: {
			en: {
				name: "Remove first heading in preview",
				desc: "When enabled, the first heading (e.g., # Title) will be removed from the file content preview.",
			},
			zh: {
				name: "移除预览中的首个标题行",
				desc: "启用后，将从文件内容预览中移除首个标题（例如 # 标题）",
			},
		},
		showFileCreationDate: {
			en: {
				name: "Show file creation date",
				desc: "When enabled, the file's creation date will be displayed in its detail section (requires 'Show file detail' to be enabled).",
			},
			zh: {
				name: "显示创建日期",
				desc: "启用后，文件详情中将显示文件的创建时间（需开启“显示文件详情”）。",
			},
		},
		fileCreationDateFormat: {
			en: {
				name: "File creation date format",
				desc: "Customize the format for displaying file creation dates. Uses dayjs format patterns. The default format is YYYY/MM/DD. See the format guide: ",
			},
			zh: {
				name: "文件创建日期格式",
				desc: "自定义文件创建日期的显示格式。使用 dayjs 库的格式化语法。默认格式为 YYYY/MM/DD。格式参考文档：",
			},
		},
		filePreviewLinesCount: {
			en: {
				name: "File preview lines",
				desc: "Set how many lines of content are displayed in the file preview below the file name. Use 0 to hide the preview completely.",
			},
			zh: {
				name: "文件预览行数",
				desc: "设置在文件名下方的文件内容预览显示多少行。设为 0 表示不显示预览。",
			},
		},
	};

export const FILE_DISPLAY_SETTINGS_COPY: SettingsLocaleResource<FileDisplaySettings> =
	{
		boldFileTitle: {
			en: {
				name: "Bold file title",
				desc: "When enabled, file titles will be displayed in bold for better emphasis and readability.",
			},
			zh: {
				name: "加粗文件标题",
				desc: "启用后，文件标题将以加粗样式显示，以增强强调和可读性。",
			},
		},
		fileItemSpacing: {
			en: {
				name: "File item spacing",
				desc: "Control the vertical spacing between file items in the list. Choose a compact or comfortable layout.",
				options: [
					{
						value: FILE_ITEM_SPACING.COMPACT,
						text: "Compact",
					},
					{
						value: FILE_ITEM_SPACING.COMFORTABLE,
						text: "Comfortable",
					},
				],
			},
			zh: {
				name: "文件项间距",
				desc: "控制文件列表中各个文件项之间的垂直间距。可选择紧凑或宽松的布局风格。",
				options: [
					{
						value: FILE_ITEM_SPACING.COMPACT,
						text: "紧凑",
					},
					{
						value: FILE_ITEM_SPACING.COMFORTABLE,
						text: "宽松",
					},
				],
			},
		},
		showFileItemDivider: {
			en: {
				name: "Show file item divider",
				desc: "When enabled, a divider line will be shown between file items in the list for clearer visual separation.",
			},
			zh: {
				name: "显示文件分割线",
				desc: "启用后，文件列表中每个文件之间将显示一条分割线，使视觉分隔更加清晰。",
			},
		},
	};

export const FOLDER_NOTE_SETTINGS_COPY: SettingsLocaleResource<FolderNoteSettings> =
	{
		autoOpenFolderNote: {
			en: {
				name: "Auto open folder note",
				desc: "Automatically open the associated folder note when a folder is selected.",
			},
			zh: {
				name: "自动打开 folder note",
				desc: "选中某个文件夹时，若存在关联的folder note，将自动打开该笔记",
			},
		},
		folderNoteLocation: {
			en: {
				name: "Folder note location",
				desc: "Choose where to look for a folder’s note file.",
				options: [
					{
						value: FOLDER_NOTE_LOCATION.INDEX_FILE,
						text: "index.md",
					},
					{
						value: FOLDER_NOTE_LOCATION.UNDERSCORE_FILE,
						text: "_folder.md",
					},
					{
						value: FOLDER_NOTE_LOCATION.FOLDER_NAME_FILE,
						text: "Same name as folder",
					},
					{
						value: FOLDER_NOTE_LOCATION.CUSTOM_LOCATION_FILE,
						text: "Custom path",
					},
				],
			},
			zh: {
				name: "Folder note 路径",
				desc: "选择用于匹配 folder note 的路径规则",
				options: [
					{
						value: FOLDER_NOTE_LOCATION.INDEX_FILE,
						text: "index.md",
					},
					{
						value: FOLDER_NOTE_LOCATION.UNDERSCORE_FILE,
						text: "_folder.md",
					},
					{
						value: FOLDER_NOTE_LOCATION.FOLDER_NAME_FILE,
						text: "文件夹同名文件",
					},
					{
						value: FOLDER_NOTE_LOCATION.CUSTOM_LOCATION_FILE,
						text: "自定义路径",
					},
				],
			},
		},
		customFolderNotePath: {
			en: {
				name: "Custom folder note path",
				desc: "Define a custom path pattern for folder notes. You can use placeholders like `{folder}` for the folder name. you can use `{folder}/index.md` or `notes/{folder}.md`.This setting only takes effect when 'Custom path' is selected above.",
			},
			zh: {
				name: "自定义 folder note 路径",
				desc: "定义 folder note 的自定义路径模式。你可以使用 `{folder}` 占位符来表示当前文件夹名称。例如，你可以使用 `{folder}/index.md` 或 `notes/{folder}.md`。只有在上方选择“自定义路径”时，该设置才会生效。",
			},
		},
		folderNoteMissingBehavior: {
			en: {
				name: "If folder note is not found",
				desc: "Choose what to do when no folder note is found for a folder.",
				options: [
					{
						value: FOLDER_NOTE_MISSING_BEHAVIOR.IGNORE,
						text: "Do nothing",
					},
					{
						value: FOLDER_NOTE_MISSING_BEHAVIOR.WARN,
						text: "Show warning",
					},
					{
						value: FOLDER_NOTE_MISSING_BEHAVIOR.CREATE,
						text: "Create new",
					},
				],
			},
			zh: {
				name: "找不到 folder note 时",
				desc: "选择当文件夹未找到 folder note 时的处理行为。",
				options: [
					{
						value: FOLDER_NOTE_MISSING_BEHAVIOR.IGNORE,
						text: "不处理",
					},
					{
						value: FOLDER_NOTE_MISSING_BEHAVIOR.WARN,
						text: "显示提醒",
					},
					{
						value: FOLDER_NOTE_MISSING_BEHAVIOR.CREATE,
						text: "自动创建",
					},
				],
			},
		},
	};

export const SETTINGS_COPY: SettingsLocaleResource<FolderFileSplitterPluginSettings> =
	{
		...STARTUP_SETTINGS_COPY,
		...LAYOUT_SETTINGS_COPY,
		...FOLDER_AND_TAG_BEHAVIOR_SETTINGS_COPY,
		...FOLDER_SETTINGS_COPY,
		...TAG_SETTINGS_COPY,
		...FILE_DETAIL_SETTINGS_COPY,
		...FILE_DISPLAY_SETTINGS_COPY,
		...FOLDER_NOTE_SETTINGS_COPY,
	};
