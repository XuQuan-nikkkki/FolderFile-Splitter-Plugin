import { HTMLAttributes, MouseEvent, ReactNode, RefObject } from "react";

import { useExplorer } from "src/hooks/useExplorer";
import { useExpandNodeByClick } from "src/hooks/useSettingsHandler";
import { EXPAND_NODE_ON_CLICK } from "src/settings";
import { AsyncNoop, Noop } from "src/utils";

import { NameRef } from "./EditableName";
import ScrollInToViewContainer from "./ScrollInToViewContainer";

type Props = {
	isFocused: boolean;
	onFocus: AsyncNoop;
	onToggle: Noop;
	nameRef: RefObject<NameRef | null>;
	children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;
const TogglableContainer = ({
	nameRef,
	isFocused,
	onFocus,
	onToggle,
	children,
	...props
}: Props) => {
	const { plugin } = useExplorer();

	const { expandNodeByClick } = useExpandNodeByClick(
		plugin.settings.expandNodeOnClick
	);

	const onClickContent = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		if (!isFocused) {
			await onFocus();
		}
		if (nameRef.current && !nameRef.current.isFocusing) {
			nameRef.current.setIsFocusing(true);
		}
		if (expandNodeByClick === EXPAND_NODE_ON_CLICK.LABEL) {
			onToggle();
		} else if (expandNodeByClick === EXPAND_NODE_ON_CLICK.SELECTED_LABEL) {
			if (nameRef.current?.isFocusing) {
				onToggle();
			}
		}
	};

	return (
		<ScrollInToViewContainer
			needToScroll={isFocused}
			onClick={onClickContent}
			{...props}
		>
			{children}
		</ScrollInToViewContainer>
	);
};

export default TogglableContainer;
