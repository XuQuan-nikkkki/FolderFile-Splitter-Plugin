import { ReactElement, useEffect, useRef, useState } from "react";

import { StyledName, StyledNameInput } from "src/components/Styled/NameInput";

type Options = {
	isFocused?: boolean;
	isBold?: boolean;
	isLarge?: boolean;
	className?: string;
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
	const inputRef = useRef<HTMLInputElement>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(defaultName);

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
		if (inputRef?.current && !inputRef.current.contains(event.target)) {
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

	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		if (event.key === "Enter") {
			event.preventDefault();
			onSaveNewName();
		} else if (event.key === "Escape") {
			event.preventDefault();
			setIsEditing(false);
			setName(defaultName);
		}
	};

	const selectText = (element: HTMLInputElement) => {
		element.focus();
		element.setSelectionRange(0, element.value.length);
	};

	const selectFileNameText = () => {
		const element = inputRef.current;
		if (element) {
			selectText(element);
		}
	};

	const renderEditableName = () => {
		const { isBold, isFocused, isLarge, className } = options ?? {};
		return isEditing ? (
			<StyledNameInput
				ref={inputRef}
				value={name}
				onKeyDown={onKeyDown}
				onChange={(e) => setName(e.target.value)}
			/>
		) : (
			<StyledName
				ref={eleRef}
				className={className}
				$isBold={isBold}
				$isFocused={isFocused}
				$isLarge={isLarge}
				suppressContentEditableWarning
			>
				{name}
			</StyledName>
		);
	};

	return {
		renderEditableName,
		selectFileNameText,
		onBeginEdit,
	};
};

export default useRenderEditableName;
