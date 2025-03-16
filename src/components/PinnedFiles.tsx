import { ReactNode, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";
import { PinIcon } from "src/assets/icons";
import { TFile } from "obsidian";
import { PinnedContent, PinnedSection, PinnedTitle } from "./Styled/Pin";
import { useFileTree } from "./FileTree";

type Props = {
	files: TFile[];
	renderFile: (
		file: TFile,
		fileList: TFile[],
		disableDrag?: boolean
	) => ReactNode;
};
const PinnedFiles = ({ files, renderFile }: Props) => {
	const { useFileTreeStore, plugin } = useFileTree();

	const { pinnedFilePaths, _updatePinnedFilePaths } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
		<PinnedSection>
			<PinnedTitle>
				<PinIcon />
				Pin
			</PinnedTitle>
			<PinnedContent>
				{pinnedFiles.map((file) => renderFile(file, pinnedFiles, true))}
			</PinnedContent>
		</PinnedSection>
	);
};

export default PinnedFiles;
