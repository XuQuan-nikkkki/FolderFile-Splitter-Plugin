import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const ArrowRightIcon = ({ className, style }: Props) => (
	<svg
		viewBox="0 0 60.2601318359375 84.8134765625"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		style={style}
	>
		<g transform="matrix(1 0 0 1 -6.194965820312518 77.63671875)">
			<path d="M66.4551-35.2539C66.4551-36.4746 65.9668-37.5977 65.0391-38.4766L26.3672-76.3672C25.4883-77.1973 24.4141-77.6367 23.1445-77.6367C20.6543-77.6367 18.7012-75.7324 18.7012-73.1934C18.7012-71.9727 19.1895-70.8496 19.9707-70.0195L55.5176-35.2539L19.9707-0.488281C19.1895 0.341797 18.7012 1.41602 18.7012 2.68555C18.7012 5.22461 20.6543 7.12891 23.1445 7.12891C24.4141 7.12891 25.4883 6.68945 26.3672 5.81055L65.0391-32.0312C65.9668-32.959 66.4551-34.0332 66.4551-35.2539Z" />
		</g>
	</svg>
);

export default ArrowRightIcon;
