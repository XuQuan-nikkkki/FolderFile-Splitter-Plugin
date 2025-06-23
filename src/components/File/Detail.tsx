import dayjs from "dayjs";
import { MarkdownRenderer, TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useFileCreationDateFormat,
	useRemoveFirstHeadingInPreview,
	useShowFileCreationDate,
	useStripMarkdownSyntaxInPreview,
} from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";


type Props = {
	file: TFile;
};
const FileDetail = ({ file }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { readFile } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			readFile: store.readFile,
		}))
	);

	const {
		showFileCreationDate: showDate,
		fileCreationDateFormat: dateFormat,
		stripMarkdownSyntaxInPreview: stripSyntax,
		removeFirstHeadingInPreview: removeHeading,
	} = settings;
	const { showFileCreationDate } = useShowFileCreationDate(showDate);
	const { fileCreationDateFormat } = useFileCreationDateFormat(dateFormat);
	const { stripMarkdownSyntaxInPreview } =
		useStripMarkdownSyntaxInPreview(stripSyntax);
	const { removeFirstHeadingInPreview } =
		useRemoveFirstHeadingInPreview(removeHeading);

	const [contentPreview, setContentPreview] = useState<string>("");

	const removeFrontMatter = (content: string): string =>
		content.replace(/^---\n[\s\S]*?\n---\n/, "").trim();

	const removeFirstHeading = (content: string): string => {
		const lines = content.split("\n");
		const firstNonEmptyLineIndex = lines.findIndex(
			(line) => line.trim() !== ""
		);
		if (
			firstNonEmptyLineIndex !== -1 &&
			/^#{1,6}\s/.test(lines[firstNonEmptyLineIndex])
		) {
			lines.splice(firstNonEmptyLineIndex, 1);
		}
		return lines.join("\n").trim();
	};

	const stripMarkdownSyntax = async (content: string): Promise<string> => {
		const container = document.createElement("div");
		await MarkdownRenderer.render(
			plugin.app,
			content,
			container,
			"",
			plugin
		);
		return container.textContent ?? "";
	};

	const maybeLoadContent = async () => {
		if (file.extension !== "md") return;
		const content = await readFile(file);
		let cleanContent = removeFrontMatter(content);
		if (removeFirstHeadingInPreview) {
			cleanContent = removeFirstHeading(cleanContent);
		}
		if (stripMarkdownSyntaxInPreview) {
			cleanContent = await stripMarkdownSyntax(cleanContent);
		}
		setContentPreview(cleanContent);
	};

	useEffect(() => {
		maybeLoadContent();
	}, [stripMarkdownSyntaxInPreview, removeFirstHeadingInPreview]);

	const onUpdatePreviewChange = (e: VaultChangeEvent) => {
		const { file: f, changeType } = e.detail;
		if (f.path !== file.path || changeType !== "modify") return;
		maybeLoadContent();
	};

	useEffect(() => {
		window.addEventListener(VaultChangeEventName, onUpdatePreviewChange);
		return () => {
			window.removeEventListener(
				VaultChangeEventName,
				onUpdatePreviewChange
			);
		};
	}, [onUpdatePreviewChange]);

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
