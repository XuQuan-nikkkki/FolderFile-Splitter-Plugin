export const getIndentStyle = (level: number, disableIndent?: boolean) => {
	if (disableIndent) return undefined;
	return {
		marginInlineStart: -17 * level,
		paddingInlineStart: 24 + 17 * level,
	};
};
