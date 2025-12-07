import { HTMLAttributes, MouseEvent, ReactNode, RefObject } from "react";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useAutoScrollToCenter,
	useExpandNodeByClick,
} from "src/hooks/useSettingsHandler";
import { EXPAND_NODE_ON_CLICK } from "src/settings";
import { AsyncNoop, Noop } from "src/utils";

import { NameRef } from "./EditableName";
import ScrollInToViewContainer from "./ScrollInToViewContainer";

type Props = {
	isFocused: boolean;
	onSelect: AsyncNoop | Noop;
	onToggleExpand: Noop;
	nameRef: RefObject<NameRef | null>;
	children: ReactNode;
	onDeselect?: AsyncNoop | Noop;
} & HTMLAttributes<HTMLDivElement>;
const TogglableContainer = ({
	nameRef,
	isFocused,
	onSelect,
	onToggleExpand,
	children,
	onDeselect,
	...props
}: Props) => {
	const { plugin } = useExplorer();
	const { settings } = plugin;

	const { expandNodeByClick } = useExpandNodeByClick(
		settings.expandNodeOnClick
	);
	const { autoScrollToCenter } = useAutoScrollToCenter(
		settings.autoScrollToCenter
	);

	const onClickContent = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		if (!isFocused) {
			await onSelect();
		} else if (onDeselect) {
			onDeselect();
		}
		if (nameRef.current) {
			if (!nameRef.current.isFocusing) {
				nameRef.current.setIsFocusing(true);
			} else if (onDeselect) {
				nameRef.current.setIsFocusing(false);
			}
		}
		if (expandNodeByClick === EXPAND_NODE_ON_CLICK.LABEL) {
			onToggleExpand();
		} else if (expandNodeByClick === EXPAND_NODE_ON_CLICK.SELECTED_LABEL) {
			if (nameRef.current?.isFocusing) {
				onToggleExpand();
			}
		}
	};

	return (
		<ScrollInToViewContainer
			needToScroll={isFocused && autoScrollToCenter}
			onClick={onClickContent}
			{...props}
		>
			{children}
		</ScrollInToViewContainer>
	);
};

export default TogglableContainer;
