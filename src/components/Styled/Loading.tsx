import styled from "styled-components";

export const StyledLoadingContainer = styled.div.attrs({
	className: "ffs__loading-container",
})`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	opacity: 0.5;
`;

export const StyledLoadingIconWrapper = styled.div.attrs({
	className: "ffs__loading-icon-wrapper",
})<{ $width: number; $height: number }>`
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
		width: ${({ $width: width }) => `${width}px`};
		height: ${({ $height: height }) => `${height}px`};
	}
`;

export const StyledLoadingText = styled.p.attrs({
	className: "ffs__loading-text",
})``