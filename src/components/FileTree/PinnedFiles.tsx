import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import File from "../File";
import { PinContainer, PinContent, PinHeader } from "../Pin";

type Props = {
	onOpenFoldersPane?: () => void;
};
const PinnedFiles = ({ onOpenFoldersPane = () => {} }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { getDisplayedPinnedFiles } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getDisplayedPinnedFiles: store.getDisplayedPinnedFiles,
			pinnedFilePaths: store.pinnedFilePaths,
		}))
	);

	const pinnedFiles = getDisplayedPinnedFiles();

	if (!pinnedFiles.length) return null;

	return (
		<PinContainer>
			<PinHeader />
			<PinContent>
				{pinnedFiles.map((file, index) => (
					<File
						key={file.path + index}
						file={file}
						disableDrag
						onOpenFoldersPane={onOpenFoldersPane}
					/>
				))}
			</PinContent>
		</PinContainer>
	);
};

export default PinnedFiles;
