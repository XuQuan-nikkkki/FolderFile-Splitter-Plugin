import { CSSProperties } from "react";

type Props = {
	className?: string;
	style?: CSSProperties;
};
const ArrowDownIcon = ({ className, style }: Props) => (
	<svg
		viewBox="0 0 84.8212890625 52.0029296875"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		style={style}
	>
		<g transform="matrix(1 0 0 1 -12.444326171874991 61.2314453125)">
			<path d="M54.8828-9.22852C56.1035-9.22852 57.3242-9.7168 58.1543-10.6445L95.9473-49.3652C96.7773-50.1953 97.2656-51.2695 97.2656-52.4902C97.2656-55.0293 95.3613-56.9824 92.8223-56.9824C91.6016-56.9824 90.4785-56.4941 89.6484-55.7129L54.8828-20.166L20.0684-55.7129C19.2871-56.4941 18.1641-56.9824 16.8945-56.9824C14.3555-56.9824 12.4512-55.0293 12.4512-52.4902C12.4512-51.2695 12.9395-50.1953 13.7695-49.3164L51.5625-10.6445C52.4902-9.7168 53.6133-9.22852 54.8828-9.22852Z" />
		</g>
	</svg>
);

export default ArrowDownIcon;
