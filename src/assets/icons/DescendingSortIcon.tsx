import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const DescendingSortIcon = ({ className, style }: Props) => {
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
			<path d="m3 16 4 4 4-4" />
			<path d="M7 20V4" />
			<path d="M11 4h10" />
			<path d="M11 8h7" />
			<path d="M11 12h4" />
		</svg>
	);
};

export default DescendingSortIcon;
