import { TAbstractFile, TFile, TFolder } from "obsidian";

type FolderChild = TFile | TFolder | TAbstractFile;
export const isFile = (item: FolderChild): item is TFile => {
	return item instanceof TFile;
};

export const isFolder = (item: FolderChild): item is TFolder => {
	return item instanceof TFolder;
};

export const isAbstractFileIncluded = (
	files: TAbstractFile[],
	file: TAbstractFile
): boolean => files.some((f) => f.path === file.path);

export const pluralize = (count: number, word: string): string => {
	return `${count} ${word}${count > 1 ? "s" : ""}`;
};

export const uniq = <T>(array: T[]): T[] => {
	return Array.from(new Set(array));
};

export const toValidNumber = (value: string | null): number | null => {
	const num = Number(value);
	return value !== null && !isNaN(num) ? num : null;
};

export const replaceItemInArray = <T>(
	array: T[],
	oldItem: T,
	newItem: T
): T[] => {
	const index = array.indexOf(oldItem);
	if (index === -1) return array;

	const newArray = [...array];
	newArray.splice(index, 1, newItem);
	return newArray;
};

export const moveItemInArray = <T>(
	array: T[],
	fromIndex: number,
	toIndex: number
): T[] => {
	if (
		fromIndex < 0 ||
		toIndex < 0 ||
		fromIndex >= array.length ||
		toIndex >= array.length ||
		fromIndex === toIndex
	) {
		return array;
	}
	const newArray = [...array];
	const [item] = newArray.splice(fromIndex, 1);
	newArray.splice(toIndex, 0, item);
	return newArray;
};

export const removeItemFromArray = <T>(array: T[], item: T): T[] => {
	return array.filter((i) => i !== item);
};

type LogErrorOptions = {
	name: string;
	error: unknown;
	data?: string;
	params?: Record<string, unknown>;
};
export function logError({
	name,
	error,
	data,
	params = {},
}: LogErrorOptions): void {
	const preview =
		data && data.length > 200 ? data.slice(0, 200) + "..." : data;
	const message = `[${name}] An error occurred.`;
	console.error(message, {
		error,
		...(preview ? { rawDataPreview: preview } : {}),
		...params,
	});
}
