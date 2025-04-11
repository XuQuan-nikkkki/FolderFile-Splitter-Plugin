import { ReactNode, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { TFile } from "obsidian";

import { ExplorerStore } from "src/store";
import { PinIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";

type Props = {
	files: TFile[];
	renderFile: (file: TFile, disableDrag?: boolean) => ReactNode;
};
const PinnedFiles = ({ files, renderFile }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { pinnedFilePaths, _updatePinnedFilePaths } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			pinnedFilePaths: store.pinnedFilePaths,
			_updatePinnedFilePaths: store._updatePinnedFilePaths,
		}))
	);

	useEffect(() => {
		const uniquePaths = [...new Set(pinnedFilePaths)].filter((path) =>
			Boolean(plugin.app.vault.getFileByPath(path))
		);
		if (uniquePaths.length !== pinnedFilePaths.length) {
			_updatePinnedFilePaths(uniquePaths);
		}
	}, [pinnedFilePaths]);

	const pinnedFiles = pinnedFilePaths
		.map((path) => files.find((f) => f.path === path))
		.filter(Boolean) as TFile[];
	if (!pinnedFiles.length) return null;
	return (
		<div className="ffs__pin-container">
			<div className="ffs__pin-header">
				<PinIcon />
				Pin
			</div>
			<div className="ffs__pin-content">
				{pinnedFiles.map((file) => renderFile(file, true))}
			</div>
		</div>
	);
};

export default PinnedFiles;
