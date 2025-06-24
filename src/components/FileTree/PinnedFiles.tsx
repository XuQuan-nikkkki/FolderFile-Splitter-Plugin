import { TFile } from "obsidian";
import { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import { PinContainer, PinContent, PinHeader } from "../Pin";

type Props = {
	renderFile: (file: TFile, disableDrag?: boolean) => ReactNode;
};
const PinnedFiles = ({ renderFile }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { pinnedFiles } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			pinnedFiles: store.getPinnedFiles,
		}))
	);

	if (!pinnedFiles().length) return null;

	return (
		<PinContainer>
			<PinHeader />
			<PinContent>
				{pinnedFiles().map((file) => renderFile(file, true))}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFiles;
