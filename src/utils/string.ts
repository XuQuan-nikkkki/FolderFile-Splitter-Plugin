import { MarkdownRenderer } from "obsidian";

import FolderFileSplitterPlugin from "src/main";

export const UNTITLED_NAME = "Untitled"
export const getAvailableName = (
	existingNames: string[],
	baseName: string
): string => {
	const usedNumbers = new Set<number>();

	existingNames.forEach((name) => {
		if (name === baseName) {
			usedNumbers.add(0);
		} else if (name.startsWith(`${baseName} `)) {
			const suffix = name.slice(baseName.length + 1).trim();
			const number = parseInt(suffix, 10);
			if (!isNaN(number)) {
				usedNumbers.add(number);
			}
		}
	});

	for (let i = 0; i <= usedNumbers.size + 1; i++) {
		if (!usedNumbers.has(i)) {
			return i === 0 ? baseName : `${baseName} ${i}`;
		}
	}

	return `${baseName} ${usedNumbers.size + 1}`;
};

export const getDefaultUntitledName = (existingNames: string[]): string => {
	const baseName = UNTITLED_NAME;
	return getAvailableName(existingNames, baseName);
};

export const getCopyName = (
	existingNames: string[],
	originalName: string
): string => {
	const baseCopyName = `${originalName} copy`;

	return getAvailableName(existingNames, baseCopyName);
};

export const removeFirstHeading = (content: string): string => {
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

export const stripMarkdownSyntax = async (
	plugin: FolderFileSplitterPlugin,
	content: string
): Promise<string> => {
	const container = document.createElement("div");
	await MarkdownRenderer.render(plugin.app, content, container, "", plugin);
	return container.textContent ?? "";
};
