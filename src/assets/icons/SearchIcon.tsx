import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const SearchIcon = ({ className, style }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
    fill="none"
		className={className}
		style={style}
	>
		<path d="m21 21-4.34-4.34" />
		<circle cx="11" cy="11" r="8" />
	</svg>
);

export default SearchIcon;
