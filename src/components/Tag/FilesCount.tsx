import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useIncludeSubTagFiles } from "src/hooks/useSettingsHandler";
import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { isFile } from "src/utils";
import { useEffect, useState } from "react";
import { useExplorer } from "src/hooks/useExplorer";
import { TagNode } from "src/store/tag";

type Props = {
	tag: TagNode;
};
const FilesCount = ({ tag }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { getFilesCountInTag } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFilesCountInTag: store.getFilesCountInTag,
		}))
	);
	const [count, setCount] = useState<number | null>(null);

	const { settings } = plugin;
	const { includeSubTagFiles } = useIncludeSubTagFiles(
		settings.includeSubTagFiles
	);

	const onHandleVaultChange = (event: VaultChangeEvent) => {
		const { file, changeType } = event.detail;
		if (!isFile(file)) return;
		if (changeType === "delete" || changeType === "rename") {
			setCount(getFilesCountInTag(tag));
		}
	};

	useEffect(() => {
		setCount(getFilesCountInTag(tag));
		window.addEventListener(VaultChangeEventName, onHandleVaultChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onHandleVaultChange
			);
		};
	}, [tag]);

	useEffect(() => {
		setCount(getFilesCountInTag(tag));
	}, [tag.children.size, includeSubTagFiles]);

	return <div className="ffs__files-count">{count}</div>;
};

export default FilesCount;
