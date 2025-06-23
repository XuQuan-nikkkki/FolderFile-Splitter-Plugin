import { useExplorer } from "src/hooks/useExplorer";
import { useLayoutMode } from "src/hooks/useSettingsHandler";
import { LAYOUT_MODE } from "src/settings";

import { HorizontalSplitLayout, VerticalSplitLayout } from "../layout";

const ExplorerContent = () => {
	const { plugin } = useExplorer();
	const { settings } = plugin;

	const { layoutMode: defaultLayout } = settings;
	const { layoutMode } = useLayoutMode(defaultLayout);

	const renderContent = () => {
		switch (layoutMode) {
			case LAYOUT_MODE.HORIZONTAL_SPLIT:
				return <HorizontalSplitLayout />;
			case LAYOUT_MODE.VERTICAL_SPLIT:
				return <VerticalSplitLayout />;
			default:
				return "unknown layout mode";
		}
	};

	return renderContent();
};

export default ExplorerContent;
