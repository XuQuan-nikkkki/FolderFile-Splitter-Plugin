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
	const baseName = "Untitled";
	return getAvailableName(existingNames, baseName);
};

export const getCopyName = (
	existingNames: string[],
	originalName: string
): string => {
	const baseCopyName = `${originalName} copy`;

	return getAvailableName(existingNames, baseCopyName);
};
