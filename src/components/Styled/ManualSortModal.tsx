import styled from "styled-components";

export const StyledPanel = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

export const StyledList = styled.div`
	overflow-y: auto;
	height: 50vh;

	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const StyledAction = styled.div`
  width: 100%;
  background-color: var(--interactive-normal);
  border-radius: var(--ffs-border-radius);
  padding: 8px 16px;
`;