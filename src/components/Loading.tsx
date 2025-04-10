import { LoadingIcon } from "src/assets/icons";

type Props = {
	width?: number;
	height?: number;
};
const Loading = ({ width = 30, height = 30 }: Props) => {
	return (
		<div className="ffs__loading-container">
			<div className="ffs__loading-icon-wrapper">
				<LoadingIcon
					className="ffs__loading-icon"
					style={{ width, height }}
				/>
			</div>
			<p className="ffs__loading-text">Loading...</p>
		</div>
	);
};

export default Loading;
