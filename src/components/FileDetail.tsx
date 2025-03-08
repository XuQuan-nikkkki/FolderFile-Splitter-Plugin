import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import styled from "styled-components";

import { FileTreeStore } from "src/store";

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
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	file: TFile;
	isFocused: boolean;
};
const FileDetail = ({ file, useFileTreeStore, isFocused }: Props) => {
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
