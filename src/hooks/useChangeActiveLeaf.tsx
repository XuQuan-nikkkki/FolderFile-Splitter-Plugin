import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { ActiveLeafChangeEventName } from "src/assets/constants";
import { ExplorerStore } from "src/store";

import { useExplorer } from "./useExplorer";

const useChangeActiveLeaf = () => {
	const { useExplorerStore, plugin } = useExplorer();

	const {
		focusedFile,
		setFocusedFileAndSave,
		expandFolder,
		changeFocusedFolder,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFile: store.focusedFile,
			expandFolder: store.expandFolder,
			changeFocusedFolder: store.changeFocusedFolder,
			setFocusedFileAndSave: store.setFocusedFileAndSave,
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
		if (!plugin.settings.revealFileInExplorer) return;
		const currentActiveFile = plugin.app.workspace.getActiveFile();
		if (currentActiveFile && currentActiveFile.path !== focusedFile?.path) {
			let currentFolder = currentActiveFile.parent;
			while (currentFolder && currentFolder.parent) {
				expandFolder(currentFolder);
				currentFolder = currentFolder.parent;
			}
			changeFocusedFolder(currentActiveFile.parent);
			await setFocusedFileAndSave(currentActiveFile);
		}
	};
};

export default useChangeActiveLeaf;
