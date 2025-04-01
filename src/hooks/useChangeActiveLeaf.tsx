import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";

import { ActiveLeafChangeEventName } from "src/assets/constants";
import { useFileTree } from "src/components/FileTree";

const useChangeActiveLeaf = () => {
	const { useFileTreeStore, plugin } = useFileTree();

	const { focusedFile, selectFile, expandFolder } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
