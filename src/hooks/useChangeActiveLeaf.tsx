import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";

import { ActiveLeafChangeEventName } from "src/assets/constants";
import { useExplorer } from "./useExplorer";

const useChangeActiveLeaf = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const { focusedFile, selectFile, expandFolder } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFile: store.focusedFile,
			selectFile: store.selectFile,
			expandFolder: store.expandFolder,
		}))
	);

	useEffect(() => {
		window.addEventListener(
			ActiveLeafChangeEventName,
			onHandleActiveLeafChange
		);
		return () => {
			window.removeEventListener(
				ActiveLeafChangeEventName,
				onHandleActiveLeafChange
			);
		};
	}, [focusedFile]);

	const onHandleActiveLeafChange = async () => {
		const currentActiveFile = plugin.app.workspace.getActiveFile();
		if (currentActiveFile && currentActiveFile.path !== focusedFile?.path) {
			let currentFolder = currentActiveFile.parent;
			while (currentFolder && currentFolder.parent) {
				expandFolder(currentFolder);
				currentFolder = currentFolder.parent;
			}
			await selectFile(currentActiveFile);
		}
	};
};

export default useChangeActiveLeaf;
