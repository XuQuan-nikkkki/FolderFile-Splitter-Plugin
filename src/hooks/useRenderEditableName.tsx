import { debounce } from "obsidian";
import { ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Name = styled.div<{
	$isEditing?: boolean;
	$isBold?: boolean;
	$isFocused?: boolean;
	$isLarge?: boolean;
}>`
	flex: 1;

	font-size: 13px;
	font-size: ${({ $isLarge }) => ($isLarge ? "14px" : "13px")};
	font-weight: ${({ $isBold }) => ($isBold ? 600 : "normal")};

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	background-color: ${({ $isEditing }) =>
		$isEditing ? "var(--text-selection)" : undefined};
	color: ${({ $isFocused }) =>
		$isFocused ? "var(--text-on-accent)" : "var(--text-normal)"};
`;

type Options = {
	isFocused?: boolean;
	isBold?: boolean;
	isLarge?: boolean;
};
const useRenderEditableName = (
	defaultName: string,
	onSaveName: (name: string) => Promise<void>,
	options?: Options
): {
	renderEditableName: () => ReactElement;
	selectFileNameText: () => void;
	onBeginEdit: () => void;
} => {
	const eleRef = useRef<HTMLDivElement>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(defaultName);
	const [isComposing, setIsComposing] = useState(false);

	const onBeginEdit = () => {
		setIsEditing(true);
		setName(name);
	};

	const onSaveNewName = async () => {
		try {
			await onSaveName(name);
			setIsEditing(false);
		} catch (error) {
			console.error("Save  failed：", error);
			alert("Content save failed, please try again!！");
		}
	};

	const onClickOutside = (event: MouseEvent) => {
		if (eleRef?.current && !eleRef.current.contains(event.target)) {
			if (isEditing) {
				onSaveNewName();
			}
		}
	};

	useEffect(() => {
		window.addEventListener("mousedown", onClickOutside);
		return () => {
			window.removeEventListener("mousedown", onClickOutside);
		};
	}, [isEditing, name]);

	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleCompositionEnd = (
		e: React.CompositionEvent<HTMLDivElement>
	) => {
		setIsComposing(false);
		const target = e.target as HTMLDivElement;
		setName(target.textContent || "");
		onMoveCursorToEnd()
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		if (event.key === "Enter" && !isComposing) {
			event.preventDefault();
			onSaveNewName();
			eleRef?.current?.blur();
		} else if (event.key === "Escape") {
			event.preventDefault();
			setIsEditing(false);
			setName(defaultName);
			eleRef.current?.blur();
		}
	};

	const selectText = (element: HTMLElement) => {
		element.focus();
		const range = document.createRange();
		range.selectNodeContents(element);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const selectFileNameText = () => {
		const element = eleRef.current;
		if (element) {
			selectText(element);
		}
	};

	const moveCursorToEnd = (element: HTMLElement) => {
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(element);
		range.collapse(false);
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const onMoveCursorToEnd = () => {
		const element = eleRef.current;
		if (element) {
			moveCursorToEnd(element);
		}
	};

	const onInputNewName = debounce((e: React.FormEvent<HTMLDivElement>) => {
		if (!isComposing) {
			const target = e.target as HTMLDivElement;
			setName(target.textContent || "");
			onMoveCursorToEnd();
		}
	}, 200);

	const renderEditableName = () => {
		const { isBold, isFocused, isLarge } = options ?? {};
		return (
			<Name
				ref={eleRef}
				$isEditing={isEditing}
				contentEditable={isEditing}
				onKeyDown={onKeyDown}
				onInput={onInputNewName}
				onCompositionStart={handleCompositionStart}
				onCompositionEnd={handleCompositionEnd}
				$isBold={isBold}
				$isFocused={isFocused}
				$isLarge={isLarge}
				suppressContentEditableWarning
			>
				{name}
			</Name>
		);
	};

	return {
		renderEditableName,
		selectFileNameText,
		onBeginEdit,
	};
};

export default useRenderEditableName;
