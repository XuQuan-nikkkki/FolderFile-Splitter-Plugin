import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";

type Props = {
	file: TFile;
};
const FileDetail = ({ file }: Props) => {
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
		<div className="ffs__file-detail">
			<div className="ffs__file-created-time">{fileCreatedDate}</div>
			<div className="ffs__file-content-preview">{contentPreview}</div>
		</div>
	);
};

export default FileDetail;
