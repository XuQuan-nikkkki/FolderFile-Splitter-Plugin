import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const CollapseIcon = ({ className, style }: Props) => {
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
			<path d="m7 20 5-5 5 5" />
			<path d="m7 4 5 5 5-5" />
		</svg>
	);
};

export default CollapseIcon;
