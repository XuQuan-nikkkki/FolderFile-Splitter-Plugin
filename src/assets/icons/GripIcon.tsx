import { CSSProperties } from "react";

type Props = {
	className?: string
	style?: CSSProperties;
};
const GripIcon = ({ className, style }: Props) => (
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
		<circle cx="9" cy="12" r="1" />
		<circle cx="9" cy="5" r="1" />
		<circle cx="9" cy="19" r="1" />
		<circle cx="15" cy="12" r="1" />
		<circle cx="15" cy="5" r="1" />
		<circle cx="15" cy="19" r="1" />
	</svg>
);

export default GripIcon;
