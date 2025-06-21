import { useEffect, useMemo, useState } from "react";

import { useShallow } from "zustand/react/shallow";

import FolderFileSplitterPlugin from "src/main";
import { createExplorerStore, ExplorerStore } from "src/store";
import { ExplorerContext } from "src/hooks/useExplorer";

import Loading from "../Loading";
import DragAndDropExplorer from "./DragAndDrop";

type Props = {
	plugin: FolderFileSplitterPlugin;
};
const Explorer = ({ plugin }: Props) => {
	const useExplorerStore = useMemo(
		() => createExplorerStore(plugin),
		[plugin]
	);

	const { restoreData } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			restoreData: store.restoreData,
		}))
	);

	const [isRestoring, setIsRestoring] = useState<boolean>(true);

	useEffect(() => {
		restoreData().then(() => setIsRestoring(false));
	}, []);

	if (isRestoring) return <Loading />;

	return (
		<ExplorerContext.Provider value={{ useExplorerStore, plugin }}>
			<DragAndDropExplorer />;
		</ExplorerContext.Provider>
	);
};

export default Explorer;
