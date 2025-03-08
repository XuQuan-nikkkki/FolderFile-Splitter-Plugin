import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const ArrowUpDownIcon = ({ className, style }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
		className={className}
		style={style}
	>
		<path d="m21 16-4 4-4-4" />
		<path d="M17 20V4" />
		<path d="m3 8 4-4 4 4" />
		<path d="M7 4v16" />
	</svg>
);

export default ArrowUpDownIcon;
