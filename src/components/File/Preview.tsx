import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { useExplorer } from "src/hooks/useExplorer";
import {
	useRemoveFirstHeadingInPreview,
	useStripMarkdownSyntaxInPreview,
} from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import {
	removeFirstHeading,
	removeFrontMatter,
	stripMarkdownSyntax,
} from "src/utils";

type Props = {
	file: TFile;
};
const FilePreview = ({ file }: Props) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { readFile } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			readFile: store.readFile,
		}))
	);

	const {
		stripMarkdownSyntaxInPreview: stripSyntax,
		removeFirstHeadingInPreview: removeHeading,
	} = settings;
	const { stripMarkdownSyntaxInPreview } =
		useStripMarkdownSyntaxInPreview(stripSyntax);
	const { removeFirstHeadingInPreview } =
		useRemoveFirstHeadingInPreview(removeHeading);

	const [contentPreview, setContentPreview] = useState<string>("");

	const maybeLoadContent = async () => {
		if (file.extension !== "md") return;
		const content = await readFile(file);
		let cleanContent = removeFrontMatter(content);
		if (removeFirstHeadingInPreview) {
			cleanContent = removeFirstHeading(cleanContent);
		}
		if (stripMarkdownSyntaxInPreview) {
			cleanContent = await stripMarkdownSyntax(plugin, cleanContent);
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

	return <div className="ffs__file-content-preview">{contentPreview}</div>;
};

export default FilePreview;
