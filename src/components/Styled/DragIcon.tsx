import { GripIcon } from "src/assets/icons";
import styled from "styled-components";
import { CSSProperties } from "react";

export const StyledIcon = styled(GripIcon)`
	width: 15px;
	height: 15px;
`;

const DraggableIconWrapper = styled.div`
	position: absolute;
	visibility: hidden;
`;

type Props = {
	className?: string;
	style?: CSSProperties;
};
const StyledDragIcon = ({ className, style }: Props) => {
	return (
		<DraggableIconWrapper className={className} style={style}>
			<StyledIcon />
		</DraggableIconWrapper>
	);
};

export default StyledDragIcon;
