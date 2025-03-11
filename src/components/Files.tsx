import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import { EmptyFolderIcon, PinIcon } from "src/assets/icons";
import { useChangeFile } from "src/hooks/useVaultChangeHandler";
import { TFile } from "obsidian";
import { PinnedContent, PinnedSection, PinnedTitle } from "./Styled/Pin";
import File from "./File";
import { useFileTree } from "./FileTree";

const StyledEmptyIcon = styled(EmptyFolderIcon)`
	width: 60px;
	height: 60px;
	fill: var(--text-faint);
`;

const NoneFilesTips = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Files = () => {
	const { useFileTreeStore } = useFileTree();

	const { sortFiles, fileSortRule } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
			sortFiles: store.sortFiles,
			fileSortRule: store.fileSortRule,
			focusedFile: store.focusedFile,
			pinnedFiles: store.pinnedFilePaths,
			FileManualSortOrder: store.filesManualSortOrder,
		}))
	);
	const { files, onDeleteFileFromList } = useChangeFile();

	const renderFile = (file: TFile, fileList: TFile[]) => (
		<File
			key={file.name}
			file={file}
			deleteFile={() => onDeleteFileFromList(file)}
			fileList={fileList}
		/>
	);

	const renderPinnedFiles = () => {
		const pinnedFilePaths = useFileTreeStore.getState().pinnedFilePaths;
		const pinnedFiles = files.filter((f) =>
			pinnedFilePaths.includes(f.path)
		);
		if (!pinnedFiles.length) return null;
		return (
			<PinnedSection>
				<PinnedTitle>
					<PinIcon />
					Pin
				</PinnedTitle>
				<PinnedContent>
					{pinnedFiles.map((file) => renderFile(file, pinnedFiles))}
				</PinnedContent>
			</PinnedSection>
		);
	};

	if (!files.length) {
		return (
			<NoneFilesTips>
				<StyledEmptyIcon />
			</NoneFilesTips>
		);
	}

	const sortedFiles = sortFiles(files, fileSortRule);
	return (
		<Fragment>
			{renderPinnedFiles()}
			{sortedFiles.map((file) => renderFile(file, sortedFiles))}
		</Fragment>
	);
};

export default Files;
