import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { FileTreeStore } from "src/store";

type Props = {
	useFileTreeStore: UseBoundStore<StoreApi<FileTreeStore>>;
	file: TFile;
};
const FileDetail = ({ file, useFileTreeStore }: Props) => {
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
		<div className="ffs-file-details">
			<span className="ffs-file-created-time">{fileCreatedDate}</span>
			<span className="ffs-file-content-preview">{contentPreview}</span>
		</div>
	);
};

export default FileDetail;
