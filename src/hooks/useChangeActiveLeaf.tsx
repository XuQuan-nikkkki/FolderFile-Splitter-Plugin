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
		changeFocusedFolder,
		isFocusedFile,
		expandAncestors,
	} = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			focusedFile: store.focusedFile,
			changeFocusedFolder: store.changeFocusedFolder,
			setFocusedFileAndSave: store.setFocusedFileAndSave,
			isFocusedFile: store.isFocusedFile,
			expandAncestors: store.expandAncestors,
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
		if (!currentActiveFile || isFocusedFile(currentActiveFile)) return;

		setFocusedFileAndSave(currentActiveFile);
		const currentFolder = currentActiveFile.parent;
		if (currentFolder) {
			expandAncestors(currentFolder);
			changeFocusedFolder(currentFolder);
		}
	};
};

export default useChangeActiveLeaf;
