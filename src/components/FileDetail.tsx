import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";
import { useFileTree } from "./FileTree";

const Detail = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 10px;
	font-size: 12px;
`;
const FileCreatedTime = styled.div<{ $isFocused: boolean }>`
	letter-spacing: -0.6px;
	font-weight: 450;
	color: ${({ $isFocused: isFocused }) =>
		isFocused ? "var(--text-on-accent)" : " var(--text-normal)"};
`;
const FileContentPreview = styled.span<{ $isFocused: boolean }>`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: ${({ $isFocused: isFocused }) =>
		isFocused ? "var(--text-on-accent)" : " var(--text-muted)"};
`;

type Props = {
	file: TFile;
	isFocused: boolean;
};
const FileDetail = ({ file, isFocused }: Props) => {
	const { useFileTreeStore } = useFileTree();

	const { readFile } = useFileTreeStore(
		useShallow((store: FileTreeStore) => ({
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
		<Detail>
			<FileCreatedTime $isFocused={isFocused}>
				{fileCreatedDate}
			</FileCreatedTime>
			<FileContentPreview $isFocused={isFocused}>
				{contentPreview}
			</FileContentPreview>
		</Detail>
	);
};

export default FileDetail;
