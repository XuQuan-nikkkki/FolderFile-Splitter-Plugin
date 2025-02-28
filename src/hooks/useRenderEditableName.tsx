import { ReactElement, useEffect, useRef, useState } from "react";

const useRenderEditableName = (
	defaultName: string,
	onSaveName: (name: string) => Promise<void>,
	getClassNames: (isEditing: boolean) => string
): {
	renderEditableName: () => ReactElement;
	selectFileNameText: () => void;
	onBeginEdit: () => void;
} => {
	const eleRef = useRef<HTMLDivElement>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(defaultName);

	const onBeginEdit = () => {
		setIsEditing(true);
		setName(name);
	};

	const onSaveNewName = async () => {
		try {
			onSaveName(name);
			setIsEditing(false);
		} catch (error) {
			console.error("Save failed：", error);
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

	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		if (event.key === "Enter") {
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

	const onInputNewName = (e: React.FormEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		setName(target.textContent || "");
		onMoveCursorToEnd();
	};

	const renderEditableName = () => {
		return (
			<div
				ref={eleRef}
				contentEditable={isEditing}
				className={getClassNames(isEditing)}
				onKeyDown={onKeyDown}
				onInput={onInputNewName}
			>
				{name}
			</div>
		);
	};

	return {
		renderEditableName,
		selectFileNameText,
		onBeginEdit
	};
};

export default useRenderEditableName;
