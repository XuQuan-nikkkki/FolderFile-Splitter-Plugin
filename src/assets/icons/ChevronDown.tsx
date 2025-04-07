import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const ChevronDown = ({ className, style }: Props) => (
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
		<path d="M3 8L12 17L21 8" />
	</svg>
);

export default ChevronDown;
