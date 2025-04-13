export interface SettingsHeaderLocaleResource {
	[key: string]: string;
}

export const EN_SETTINGS_HEADER: SettingsHeaderLocaleResource = {
	startup: "🔷 Startup",
	layout: "🧭 Layout",
	folderAndFileBehavior: "📁 Folder and file behavior",
};
export const ZH_SETTINGS_HEADER: SettingsHeaderLocaleResource = {
	startup: "🔷 启动设置",
	layout: "🧭 布局设置",
	folderAndFileBehavior: "📁 文件夹和文件行为",
};

export interface SettingsLocaleResource {
	[key: string]: {
		name: string;
		desc: string;
		options?: Record<string, string>;
	};
}
export const EN_SETTINGS: SettingsLocaleResource = {
	openOnStartup: {
		name: "Open plugin view on startup",
		desc: "When enabled, the plugin view will be opened automatically when Obsidian starts.",
	},
	layoutMode: {
		name: "Layout mode",
		desc: "Choose how to display folders and files in the plugin view. You can arrange them side-by-side, stacked vertically, or use a toggle view that switches between folders and files.",
		options: {
			horizontalSplit: "Horizontal split",
			verticalSplit: "Vertical split",
		},
	},
	showFileDetail: {
		name: "Show file detail",
		desc: "When enabled, file details such as creation time and a content preview will be displayed below the file name.",
	},
	showHierarchyLines: {
		name: "Show folder hierarchy lines",
		desc: "When enabled, a line will be displayed next to folders in the same hierarchy level under an expanded parent folder, visually indicating their nesting relationship.",
	},
	showFolderIcon: {
		name: "Show folder icon",
		desc: "Enable this option to display icon next to folder, enhancing visual distinction between folders and files.	",
	},
	showFileItemDivider: {
		name: "Show file item divider",
		desc: "When enabled, a divider line will be shown between file items in the list for clearer visual separation.",
	},
	fileItemSpacing: {
		name: "File item spacing",
		desc: "Control the vertical spacing between file items in the list. Choose a compact or comfortable layout.",
		options: {
			compact: "Compact",
			comfortable: "Comfortable",
		},
	},
	highlightActionBar: {
		name: "Highlight action bar",
		desc: "When enabled, the top action buttons will have a background and margin to distinguish them from surrounding elements.",
	},
	autoHideActionBar: {
		name: "Auto-hide action bar",
		desc: "When enabled, the top action bar will be hidden by default and only appear when hovering over it.",
	},
	expandFolderOnClick: {
		name: "Expand folder on click",
		desc: "Choose whether to expand a folder by clicking on the toggle icon (▶/▼) or the folder name.",
		options: {
			icon: "Toggle Icon",
			folder: "Folder Name",
		},
	},
	includeSubfolderFilesCount: {
		name: "Include subfolder files count",
		desc: "When enabled, the file count will include files inside subfolders. Otherwise, only direct child files are counted.",
	},
	showFilesFromSubfolders: {
		name: "Show files from subfolders",
		desc: "When enabled, the file list will include files from subfolders of the selected folder.",
	},
	openDestinationFolder: {
		name: "Open destination folder after move",
		desc: "When enabled, the destination folder will automatically open after moving a file or folder.",
	},
	hideRootFolder: {
		name: "Hide root folder",
		desc: "When enabled, the root folder will be hidden from the folder view. Only its subfolders will be shown.",
	},
};

export const ZH_SETTINGS: SettingsLocaleResource = {
	openOnStartup: {
		name: "启动时自动打开插件视图",
		desc: "启用后，Obsidian 启动时会自动打开插件视图。",
	},
	layoutMode: {
		name: "布局模式",
		desc: "选择插件视图中文件夹和文件的显示方式：水平分割（文件夹和文件两列并排）、垂直分割（文件夹和文件列垂直堆叠），或切换视图（通过切换视图在两者间转换）。",
		options: {
			horizontalSplit: "水平分割",
			verticalSplit: "垂直分割",
		},
	},
	showFileDetail: {
		name: "显示文件详情",
		desc: "启用后，文件名下方会显示创建时间和内容预览等详细信息。",
	},
	showHierarchyLines: {
		name: "显示文件夹层级线",
		desc: "启用后，展开的父文件夹下会显示同级文件夹的层级线，直观展示嵌套关系。",
	},
	showFolderIcon: {
		name: "显示文件夹图标",
		desc: "启用后，文件夹旁会显示图标，便于区分文件夹和文件。",
	},
	fileItemSpacing: {
		name: "文件项间距",
		desc: "控制文件列表中各个文件项之间的垂直间距。可选择紧凑或宽松的布局风格。",
		options: {
			compact: "紧凑",
			comfortable: "宽松",
		},
	},
	showFileItemDivider: {
		name: "显示文件分割线",
		desc: "启用后，文件列表中每个文件之间将显示一条分割线，使视觉分隔更加清晰。",
	},
	highlightActionBar: {
		name: "高亮操作栏",
		desc: "启用后，顶部操作按钮区域将添加背景色和边距，以增强与周围内容的区分。",
	},
	autoHideActionBar: {
		name: "自动隐藏操作栏",
		desc: "启用后，顶部操作栏默认隐藏，鼠标悬停时才会显示。",
	},
	expandFolderOnClick: {
		name: "点击展开文件夹",
		desc: "选择通过点击切换图标（▶/▼）或文件夹名称来展开文件夹。",
		options: {
			icon: "切换图标",
			folder: "文件夹名称",
		},
	},
	includeSubfolderFilesCount: {
		name: "包含子文件夹文件计数",
		desc: "启用后，文件计数会包含子文件夹内的文件；否则仅统计直接子文件。",
	},
	showFilesFromSubfolders: {
		name: "显示子文件夹中的文件",
		desc: "启用后，文件列表会包含所选文件夹的子文件夹中的文件。",
	},
	openDestinationFolder: {
		name: "移动后打开目标文件夹",
		desc: "启用后，在移动文件或文件夹后，目标文件夹将自动展开并显示。",
	},
	hideRootFolder: {
		name: "隐藏根文件夹",
		desc: "启用后，文件夹视图中将隐藏根文件夹，只显示其子文件夹。",
	},
};
