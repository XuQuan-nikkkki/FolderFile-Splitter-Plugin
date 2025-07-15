import classNames from "classnames";

import {
	ACTION_BUTTON_WRAPPER_CLASS_NAME,
	ACTIONS_SECTION_CLASS_NAME,
} from "src/assets/constants";
import { FolderIcon, TagIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useShowFolderView,
	useShowTagView,
} from "src/hooks/useSettingsHandler";
import { TIPS_COPY } from "src/locales";

const IconClassNames = `ffs__action-button svg-icon `;

const ToggleFolderAndTagMode = () => {
	const { plugin } = useExplorer();
	const { language, settings } = plugin;

	const { showFolderView } = useShowFolderView(settings.showFolderView);
	const { showTagView } = useShowTagView(settings.showTagView);

	const copy_lang = language === "zh" ? "zh" : "en";

	const getButtonClassNames = (disabled: boolean) =>
		classNames(ACTION_BUTTON_WRAPPER_CLASS_NAME, {
			"ffs__action-button-wrapper--inactive": disabled,
		});

	const renderFolderButton = () => {
		const copy = !showFolderView
			? TIPS_COPY.showFolders
			: TIPS_COPY.hideFolders;
		return (
			<div
				className={getButtonClassNames(!showFolderView)}
				aria-label={copy[copy_lang]}
				data-tooltip-position="bottom"
				onClick={async () =>
					await plugin.changeSetting(
						"showFolderView",
						!showFolderView
					)
				}
			>
				<FolderIcon className={`${IconClassNames} ffs__folder-icon`} />
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
				onClick={async () =>
					await plugin.changeSetting("showTagView", !showTagView)
				}
			>
				<TagIcon className={IconClassNames} />
			</div>
		);
	};

	return (
		<div className={ACTIONS_SECTION_CLASS_NAME}>
			{renderFolderButton()}
			{renderTagButton()}
		</div>
	);
};

export default ToggleFolderAndTagMode;
