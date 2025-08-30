import { MarkdownRenderer } from "obsidian";

import FolderFileSplitterPlugin from "src/main";

export const UNTITLED_NAME = "Untitled";
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

const textCollator = new Intl.Collator(undefined, { sensitivity: "base" });
const rawCollator = new Intl.Collator(undefined, { sensitivity: "variant" });

type NameSegment = {
	type: "number" | "text";
	raw: string;
	numericValue?: number;
};

export const splitNameIntoSegments = (name: string): NameSegment[] => {
	const trimmedName = name.trim();
	const segments: NameSegment[] = [];
	const numberPattern = /(\d+)/g; // 匹配非负整数
	let lastIndex = 0;

	for (const match of trimmedName.matchAll(numberPattern)) {
		const index = (match as any).index as number;
		if (index > lastIndex) {
			segments.push({
				type: "text",
				raw: trimmedName.slice(lastIndex, index),
			});
		}
		const rawNumber = match[1];
		segments.push({
			type: "number",
			raw: rawNumber,
			numericValue: Number(rawNumber),
		});
		lastIndex = index + rawNumber.length;
	}

	if (lastIndex < trimmedName.length) {
		segments.push({ type: "text", raw: trimmedName.slice(lastIndex) });
	}
	return segments;
};

export const compareNaturalName = (aName: string, bName: string): number => {
	const aSegments = splitNameIntoSegments(aName);
	const bSegments = splitNameIntoSegments(bName);
	const maxLen = Math.max(aSegments.length, bSegments.length);

	for (let i = 0; i < maxLen; i++) {
		const aSegment = aSegments[i];
		const bSegment = bSegments[i];

		if (!aSegment) return -1; // a 短 → 在前
		if (!bSegment) return 1; // b 短 → 在前

		if (aSegment.type !== bSegment.type) {
			// 规则：数字段优先于文字段
			return aSegment.type === "number" ? -1 : 1;
		}

		if (aSegment.type === "number") {
			if (
				aSegment.numericValue !== undefined &&
				bSegment.numericValue !== undefined &&
				aSegment.numericValue !== bSegment.numericValue
			) {
				return aSegment.numericValue - bSegment.numericValue;
			}
			// 数值相同 → 位数短者优先 (7 < 007)
			if (aSegment.raw.length !== bSegment.raw.length) {
				return aSegment.raw.length - bSegment.raw.length;
			}
		} else {
			const result = textCollator.compare(aSegment.raw, bSegment.raw);
			if (result !== 0) return result;
		}
	}
	// 所有段都相同 → 用原始字符串做兜底比较，保证稳定性
	return rawCollator.compare(aName, bName);
};
