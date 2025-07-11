import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";

type Props = {
	needToScroll: boolean;
	children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;
const ScrollInToViewContainer = ({
	needToScroll,
	children,
	...props
}: Props) => {
	const eleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (needToScroll) {
			setTimeout(() => {
				eleRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 100);
		}
	}, [needToScroll]);

	return (
		<div ref={eleRef} {...props}>
			{children}
		</div>
	);
};

export default ScrollInToViewContainer;
