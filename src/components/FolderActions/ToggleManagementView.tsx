import classNames from "classnames";
import { FolderIcon, TagIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { TIPS_COPY } from "src/locales";

const ToggleManagementMode = () => {
	const { plugin } = useExplorer();

	const { language, settings } = plugin;

	const { showFolderView } = useShowFolderView(settings.showFolderView);
	const { showTagView } = useShowTagView(settings.showTagView);

	const copy_lang = language === "zh" ? "zh" : "en";

	const updateView = async (
		key: "showFolderView" | "showTagView",
		value: boolean
	) => {
		plugin.settings[key] = value;
		await plugin.saveSettings();
		plugin.triggerSettingsChangeEvent(key, value);
	};

	const getButtonClassNames = (disabled: boolean) =>
		classNames(
			"ffs__action-button-wrapper clickable-icon nav-action-button",
			{
				"ffs_action-button-wrapper--disabled": disabled,
			}
		);

	const renderFolderButton = () => {
		const copy = !showFolderView
			? TIPS_COPY.showFolders
			: TIPS_COPY.hideFolders;
		return (
			<div
				className={getButtonClassNames(!showFolderView)}
				aria-label={copy[copy_lang]}
				data-tooltip-position="bottom"
				onClick={() => updateView("showFolderView", !showFolderView)}
			>
				<FolderIcon className="ffs__action-button svg-icon ffs__folder-icon" />
			</div>
		);
	};

	const renderTagButton = () => {
		const copy = !showTagView ? TIPS_COPY.showTags : TIPS_COPY.hideTags;
		return (
			<div
				className={getButtonClassNames(!showTagView)}
				aria-label={copy[copy_lang]}
				data-tooltip-position="bottom"
				onClick={() => updateView("showTagView", !showTagView)}
			>
				<TagIcon className="ffs__action-button svg-icon" />
			</div>
		);
	};

	return (
		<div className="ffs__actions-section nav-buttons-container">
			{renderFolderButton()}
			{renderTagButton()}
		</div>
	);
};

export default ToggleManagementMode;
