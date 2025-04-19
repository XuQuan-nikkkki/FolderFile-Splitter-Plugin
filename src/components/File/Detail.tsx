import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import dayjs from "dayjs";

import { ExplorerStore } from "src/store";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useFileCreationDateFormat,
	useShowFileCreationDate,
} from "src/hooks/useSettingsHandler";

type Props = {
	file: TFile;
};
const FileDetail = ({ file }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();

	const { readFile } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			readFile: store.readFile,
		}))
	);

	const { settings } = plugin;
	const { showFileCreationDate } = useShowFileCreationDate(
		settings.showFileCreationDate
	);
	const { fileCreationDateFormat } = useFileCreationDateFormat(
		settings.fileCreationDateFormat
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

	const maybeRenderCreatedDate = () => {
		if (!showFileCreationDate) return null;
		return (
			<div className="ffs__file-created-time">
				{dayjs(file.stat.ctime).format(fileCreationDateFormat)}
			</div>
		);
	};

	return (
		<div className="ffs__file-detail">
			{maybeRenderCreatedDate()}
			<div className="ffs__file-content-preview">{contentPreview}</div>
		</div>
	);
};

export default FileDetail;
