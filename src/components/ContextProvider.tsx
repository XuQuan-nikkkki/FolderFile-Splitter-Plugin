import { ReactNode, useMemo } from "react";

import { ExplorerContext } from "src/hooks/useExplorer";
import FolderFileSplitterPlugin from "src/main";
import { createExplorerStore } from "src/store";

type Props = {
	plugin: FolderFileSplitterPlugin;
	children: ReactNode;
};
const ContextProvider = ({ plugin, children }: Props) => {
	const useExplorerStore = useMemo(
		() => createExplorerStore(plugin),
		[plugin]
	);

	return (
		<ExplorerContext.Provider value={{ useExplorerStore, plugin }}>
			{children}
		</ExplorerContext.Provider>
	);
};

export default ContextProvider;
