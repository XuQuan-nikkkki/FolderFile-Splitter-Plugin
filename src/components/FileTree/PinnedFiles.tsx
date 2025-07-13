import { TFile } from "obsidian";
import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import { PinContainer, PinContent, PinHeader } from "../Pin";

type Props = {
	renderFile: (file: TFile, index: number, disableDrag?: boolean) => ReactNode;
};
const PinnedFiles = ({ renderFile }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { getDisplayedPinnedFiles } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getDisplayedPinnedFiles: store.getDisplayedPinnedFiles,
			pinnedFilePaths: store.pinnedFilePaths,
		}))
	);

	if (!getDisplayedPinnedFiles().length) return null;

	return (
		<PinContainer>
			<PinHeader />
			<PinContent>
				{getDisplayedPinnedFiles().map((file, index) =>
					renderFile(file, index, true)
				)}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFiles;
