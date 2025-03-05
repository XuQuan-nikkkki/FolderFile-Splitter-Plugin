import { LoadingIcon } from "src/assets/icons";

type Props = {
	width?: number;
	height?: number;
};
const Loading = ({ width = 30, height = 30 }: Props) => {
	return (
		<div className="loading">
			<div className="loading-icon">
				<LoadingIcon />
			</div>
			<p>Loading...</p>
			<style>
				{`
					.loading {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0.5
					}

					@keyframes spin {
						from {
							transform: rotate(0deg);
						}
						to {
							transform: rotate(360deg);
						}
					}

					.loading-icon {
						animation: spin 3s linear infinite;
						width: ${width}px;
						height: ${height}px;
					}
				`}
			</style>
		</div>
	);
};

export default Loading;
