import { CSSProperties, ReactNode } from "react";

import { PinIcon } from "src/assets/icons";

type ContainerProps = {
	children: ReactNode;
};
const PinContainer = ({ children }: ContainerProps) => (
	<div className="ffs__pin-container">{children}</div>
);

const PinHeader = () => (
	<div className="ffs__pin-header">
		<PinIcon />
		Pin
	</div>
);

type ContentProps = {
	children: ReactNode;
	style?: CSSProperties;
};
const PinContent = ({ children, style }: ContentProps) => (
	<div className="ffs__pin-content" style={style}>
		{children}
	</div>
);

export { PinContainer, PinHeader, PinContent };
