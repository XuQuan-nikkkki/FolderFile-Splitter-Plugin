import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";

import {
	StyledFileDetail,
	StyledFileContentPreview,
	StyledFileCreatedTime,
} from "./Styled";

type Props = {
	file: TFile;
	isFocused: boolean;
};
const FileDetail = ({ file, isFocused }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { readFile } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			readFile: store.readFile,
		}))
	);

	const [contentPreview, setContentPreview] = useState<string>("");

	const maybeLoadContent = async () => {
		if (file.extension !== "md") return;
		const content = await readFile(file);
		const cleanContent = content
			.replace(/^---\n[\s\S]*?\n---\n/, "")
			.trim();
		setContentPreview(cleanContent);
	};

	useEffect(() => {
		maybeLoadContent();
	}, []);

	const fileCreatedDate = new Date(file.stat.ctime)
		.toLocaleString()
		.split(" ")[0];
	return (
		<StyledFileDetail>
			<StyledFileCreatedTime $isFocused={isFocused}>
				{fileCreatedDate}
			</StyledFileCreatedTime>
			<StyledFileContentPreview $isFocused={isFocused}>
				{contentPreview}
			</StyledFileContentPreview>
		</StyledFileDetail>
	);
};

export default FileDetail;
