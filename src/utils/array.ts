export const uniq = <T>(array: T[]): T[] => {
	return Array.from(new Set(array));
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

export const appendMissingItems = <T>(
	existing: T[],
	expected: T[],
	isMissing?: (item: T) => boolean
): T[] => {
	const missingItems = expected.filter((item) =>
		isMissing ? isMissing(item) : !existing.includes(item)
	);
	return [...existing, ...missingItems];
};

export const areArraysEqual = <T>(
	array1: T[],
	array2: T[],
	isEqual?: (a: T, b: T) => boolean
): boolean => {
	if (array1.length !== array2.length) return false;

	return array1.every((item, index) => {
		const other = array2[index];
		return isEqual ? isEqual(item, other) : item === other;
	});
};

export const isLastInArray = <T>(
	array: T[],
	item: T,
	findIndexFn?: (array: T[], item: T) => number
): boolean => {
	const index = findIndexFn ? findIndexFn(array, item) : array.indexOf(item);
	return index === array.length - 1;
};
