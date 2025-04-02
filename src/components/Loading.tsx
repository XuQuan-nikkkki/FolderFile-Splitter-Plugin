import { LoadingIcon } from "src/assets/icons";

import {
	StyledLoadingContainer,
	StyledLoadingIconWrapper,
	StyledLoadingText,
} from "./Styled/Loading";

type Props = {
	width?: number;
	height?: number;
};
const Loading = ({ width = 30, height = 30 }: Props) => {
	return (
		<StyledLoadingContainer>
			<StyledLoadingIconWrapper $width={width} $height={height}>
				<LoadingIcon />
			</StyledLoadingIconWrapper>
			<StyledLoadingText>Loading...</StyledLoadingText>
		</StyledLoadingContainer>
	);
};

export default Loading;
