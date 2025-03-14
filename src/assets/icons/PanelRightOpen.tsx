import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const PanelRightOpen = ({ className, style }: Props) => (
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
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M15 3v18" />
		<path d="m10 15-3-3 3-3" />
	</svg>
);

export default PanelRightOpen;
