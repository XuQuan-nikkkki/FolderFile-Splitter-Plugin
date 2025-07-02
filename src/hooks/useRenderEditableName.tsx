import classNames from "classnames";
import {
	ReactElement,
	Ref,
	RefObject,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

import { Noop } from "src/utils";

type Options = {
	className?: string;
	bold?: boolean;
};
const useRenderEditableName = (
	defaultName: string,
	onSaveName: (name: string) => Promise<void>,
	options?: Options,
	ref?: Ref<{ selectFileNameText: Noop }>
): {
	renderEditableName: () => ReactElement;
	isEditing: boolean;
	onStartEditingName: Noop;
	setIsFocusing: (isFocusing: boolean) => void;
	contentRef: RefObject<HTMLDivElement>;
} => {
	const eleRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [isFocusing, setIsFocusing] = useState<boolean>(false);
	const [name, setName] = useState(defaultName);

	const onBeginEdit = () => {
		setIsEditing(true);
		setName(name);
	};

	const onSaveNewName = async () => {
		try {
			await onSaveName(name.trim());
		} catch (error) {
			console.error("Save  failed：", error);
			alert("Content save failed, please try again!！");
			setName(defaultName);
		} finally {
			setIsEditing(false);
		}
	};

	const onClickOutside = (event: MouseEvent) => {
		const { current: input } = inputRef;
		const { current: content } = contentRef;
		const node = event.target as Node;
		if (input && !input.contains(node)) {
			if (isEditing) {
				onSaveNewName();
			}
		}
		if (content && !content.contains(node)) {
			setIsFocusing(false);
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
			if (isFocusing && !isEditing) {
				onStartEditingName();
			} else {
				event.preventDefault();
				onSaveNewName();
			}
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

	const onStartEditingName = () => {
		onBeginEdit();
		setTimeout(() => {
			selectFileNameText();
		}, 100);
	};

	useImperativeHandle(
		ref,
		() => ({
			selectFileNameText,
		}),
		[selectFileNameText]
	);

	const renderEditableName = () => {
		const { className, bold } = options ?? {};
		return isEditing ? (
			<input
				ref={inputRef}
				className="ffs__name-input"
				value={name}
				onKeyDown={onKeyDown}
				onChange={(e) => setName(e.target.value)}
			/>
		) : (
			<div
				ref={eleRef}
				className={classNames("ffs__name", className, {
					"ffs__name--bold": bold,
				})}
			>
				{name}
			</div>
		);
	};

	return {
		renderEditableName,
		isEditing,
		onStartEditingName,
		setIsFocusing,
		contentRef,
	};
};

export default useRenderEditableName;
