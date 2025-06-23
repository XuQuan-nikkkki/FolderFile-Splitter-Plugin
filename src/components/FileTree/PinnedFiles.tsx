import { TFile } from "obsidian";
import { ReactNode, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { uniq } from "src/utils";

import { PinContainer, PinContent, PinHeader } from "../Pin";

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
		const uniquePaths = uniq(pinnedFilePaths).filter((path) =>
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
		<PinContainer>
			<PinHeader />
			<PinContent>
				{pinnedFiles.map((file) => renderFile(file, true))}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFiles;
