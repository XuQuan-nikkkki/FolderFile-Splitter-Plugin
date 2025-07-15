import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { ExplorerStore } from "src/store";
import {
	removeFirstHeading,
	removeFrontMatter,
	stripMarkdownSyntax,
} from "src/utils";

import { useExplorer } from "./useExplorer";
import {
	useRemoveFirstHeadingInPreview,
	useStripMarkdownSyntaxInPreview,
} from "./useSettingsHandler";

const usePreviewFile = (file: TFile) => {
	const { useExplorerStore, plugin } = useExplorer();
	const { settings } = plugin;

	const { readFile, getFilePreview, hasCachedFilePreview, setFilePreview } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				readFile: store.readFile,
				getFilePreview: store.getFilePreview,
				setFilePreview: store.setFilePreview,
				hasCachedFilePreview: store.hasCachedFilePreview,
			}))
		);

	const {
		stripMarkdownSyntaxInPreview: stripSyntaxSetting,
		removeFirstHeadingInPreview: removeHeadingSetting,
	} = settings;

	const { stripMarkdownSyntaxInPreview } =
		useStripMarkdownSyntaxInPreview(stripSyntaxSetting);
	const { removeFirstHeadingInPreview } =
		useRemoveFirstHeadingInPreview(removeHeadingSetting);

	const [preview, setPreview] = useState(() => getFilePreview(file) ?? "");
	const [isLoading, setIsLoading] = useState(false);

	const getPreviewContent = (
		cleanContent: string,
		maxChars = 100
	): string => {
		const normalized = cleanContent.replace(/\s+/g, " ").trim();
		return normalized.slice(0, maxChars);
	};

	const onBuildPreview = async () => {
		if (file.extension !== "md") return;

		setIsLoading(true);
		const raw = await readFile(file);
		let content = removeFrontMatter(raw);

		if (removeFirstHeadingInPreview) {
			content = removeFirstHeading(content);
		}
		if (stripMarkdownSyntaxInPreview) {
			content = await stripMarkdownSyntax(plugin, content);
		}

		const visible = getPreviewContent(content);
		if (getFilePreview(file) === visible) {
			setIsLoading(false);
			return;
		}

		setFilePreview(file, visible);
		setPreview(visible);
		setIsLoading(false);
	};

	useEffect(() => {
		if (!hasCachedFilePreview(file)) {
			onBuildPreview();
		}
	}, [file.path, removeFirstHeadingInPreview, stripMarkdownSyntaxInPreview]);

	useEffect(() => {
		const handler = (e: VaultChangeEvent) => {
			const { file: changedFile, changeType } = e.detail;
			if (changedFile.path === file.path && changeType === "modify") {
				onBuildPreview();
			}
		};
		window.addEventListener(VaultChangeEventName, handler);
		return () => {
			window.removeEventListener(VaultChangeEventName, handler);
		};
	}, [file.path, removeFirstHeadingInPreview, stripMarkdownSyntaxInPreview]);

	return { preview, isLoading };
};

export default usePreviewFile;
