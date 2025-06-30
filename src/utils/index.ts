export const pluralize = (count: number, word: string): string => {
	return `${count} ${word}${count > 1 ? "s" : ""}`;
};

export const toValidNumber = (value: string | null): number | null => {
	const num = Number(value);
	return value !== null && !isNaN(num) ? num : null;
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

export * from "./array";
export * from "./file";
export * from "./string";
