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
		<path d="m6 9 6 6 6-6" />
	</svg>
);

export default ChevronDown;
