import styled from "styled-components";

const StyledActionIconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px;

	svg {
		width: 18px;
		height: 18px;
		stroke: var(--icon-color);
	}
	svg:hover {
		transform: scale(1.1);
	}
`;

export default StyledActionIconWrapper;
