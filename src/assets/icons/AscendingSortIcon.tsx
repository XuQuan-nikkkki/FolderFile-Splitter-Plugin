import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const AscendingSortIcon = ({ className, style }: Props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			style={style}
		>
			<path d="m3 8 4-4 4 4" />
			<path d="M7 4v16" />
			<path d="M11 12h4" />
			<path d="M11 16h7" />
			<path d="M11 20h10" />
		</svg>
	);
};

export default AscendingSortIcon;
