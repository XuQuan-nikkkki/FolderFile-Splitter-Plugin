import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";

import { ActiveLeafChangeEventName } from "src/assets/constants";
import { useExplorer } from "./useExplorer";

const useChangeActiveLeaf = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const { focusedFile, setFocusedFile, expandFolder, setFocusedFolder } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				focusedFile: store.focusedFile,
				expandFolder: store.expandFolder,
				setFocusedFolder: store.setFocusedFolder,
				setFocusedFile: store.setFocusedFile,
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
		if (!plugin.settings.revealFileInExplorer) return
		const currentActiveFile = plugin.app.workspace.getActiveFile();
		if (currentActiveFile && currentActiveFile.path !== focusedFile?.path) {
			let currentFolder = currentActiveFile.parent;
			while (currentFolder && currentFolder.parent) {
				expandFolder(currentFolder);
				currentFolder = currentFolder.parent;
			}
			setFocusedFolder(currentActiveFile.parent);
			await setFocusedFile(currentActiveFile);
		}
	};
};

export default useChangeActiveLeaf;
