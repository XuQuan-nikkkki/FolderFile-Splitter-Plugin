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

	const usedIndices = new Set<number>();

	for (const item1 of array1) {
		const index = array2.findIndex((item2, i) => {
			if (usedIndices.has(i)) return false;
			return isEqual ? isEqual(item1, item2) : item1 === item2;
		});

		if (index === -1) return false;
		usedIndices.add(index);
	}

	return true;
};
