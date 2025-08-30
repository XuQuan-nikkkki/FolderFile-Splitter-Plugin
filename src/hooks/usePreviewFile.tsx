import { TFile } from "obsidian";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { VaultChangeEvent, VaultChangeEventName } from "src/assets/constants";
import { ExplorerStore } from "src/store";
import {
	buildPreviewSignature,
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

	const { readFile, getFileRaw, setFileRaw, getFilePreview, setFilePreview } =
		useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				readFile: store.readFile,
				getFileRaw: store.getFileRaw,
				setFileRaw: store.setFileRaw,
				getFilePreview: store.getFilePreview,
				setFilePreview: store.setFilePreview,
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

	const signature = useMemo(
		() =>
			buildPreviewSignature({
				stripMarkdownSyntaxInPreview,
				removeFirstHeadingInPreview,
			}),
		[stripMarkdownSyntaxInPreview, removeFirstHeadingInPreview]
	);

	const [preview, setPreview] = useState(
		() => getFilePreview(file, signature) ?? ""
	);
	const [isLoading, setIsLoading] = useState(false);

	const buildPreview = async () => {
		if (file.extension !== "md") return;

		setIsLoading(true);

		let raw: string | undefined = getFileRaw(file);
		if (!raw) {
			raw = await readFile(file);
			setFileRaw(file, raw);
		}

		let content = removeFrontMatter(raw);

		if (removeFirstHeadingInPreview) {
			content = removeFirstHeading(content);
		}
		if (stripMarkdownSyntaxInPreview) {
			content = await stripMarkdownSyntax(plugin, content);
		}

		setFilePreview(file, content, signature);
		setPreview(content);
		setIsLoading(false);
	};

	useEffect(() => {
		const cached = getFilePreview(file, signature);
		if (cached !== undefined) {
			setPreview(cached);
		} else {
			// 兼容老 API：如果 hasCached 只按 path 判断，签名变化会返回 true，
			// 因此还是走 getFilePreview(file, signature) 的分支更可靠
			buildPreview();
		}
	}, [file.path, signature]);

	useEffect(() => {
		const handler = (e: VaultChangeEvent) => {
			const { file: changedFile, changeType } = e.detail;
			if (changedFile.path === file.path && changeType === "modify") {
				buildPreview();
			}
		};
		window.addEventListener(VaultChangeEventName, handler);
		return () => window.removeEventListener(VaultChangeEventName, handler);
	}, [file.path, signature]);

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--file-preview-lines",
			String(settings.filePreviewLinesCount)
		);
	}, [settings.filePreviewLinesCount]);

	return { preview, isLoading };
};

export default usePreviewFile;
