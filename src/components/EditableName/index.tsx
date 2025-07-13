import classNames from "classnames";
import { Notice } from "obsidian";
import {
	forwardRef,
	RefObject,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

import { isZh, Noop } from "src/utils";

export type NameRef = {
	isFocusing: boolean;
	setIsFocusing: (isFocusing: boolean) => void;
	onStartEditingName: Noop;
};

type Props = {
	names: string[];
	defaultName: string;
	onSaveName: (name: string) => Promise<void>;
	contentRef: RefObject<HTMLDivElement | null>;
	isFocused: boolean;
	className?: string;
	boldName?: boolean;
};
const EditableName = forwardRef(
	(
		{
			names,
			defaultName,
			onSaveName,
			isFocused,
			className = "",
			boldName = false,
			contentRef,
		}: Props,
		ref
	) => {
		const eleRef = useRef<HTMLDivElement>(null);
		const inputRef = useRef<HTMLInputElement>(null);

		const [isEditing, setIsEditing] = useState(false);
		const [isFocusing, setIsFocusing] = useState<boolean>(false);
		const [name, setName] = useState(defaultName);

		useEffect(() => {
			setIsFocusing(false);
		}, [isFocused]);

		useEffect(() => {
			if (isFocused) {
				setTimeout(() => {
					setIsFocusing(true);
				}, 100);
			}
		}, []);

		const selectFileNameText = () => {
			const inputEle = inputRef.current;
			if (inputEle) {
				inputEle.focus();
				inputEle.setSelectionRange(0, inputEle.value.length);
			}
		};

		const onStartEditingName = () => {
			setIsEditing(true);
			setName(name);
			setTimeout(() => {
				selectFileNameText();
			}, 100);
		};

		const onCancelEditing = () => {
			setIsEditing(false);
			setName(defaultName);
		};

		const onSaveNewName = async () => {
			const newName = name.trim();
			const sameNames = names.filter((n) => n === newName);
			if (sameNames.length > 1) {
				const tips = isZh
					? "❌ 名称已被使用，请尝试其他名称。"
					: "❌ Name already exists. Choose a different one.";
				new Notice(tips);
				return;
			}

			try {
				await onSaveName(newName);
				setIsEditing(false);
			} catch (error) {
				onCancelEditing();
				throw error;
			}
		};

		const onKeyDownInInput = (
			event: React.KeyboardEvent<HTMLDivElement>
		): void => {
			event.stopPropagation();

			if (event.key === "Escape") {
				event.preventDefault();
				onCancelEditing();
				return;
			}

			if (event.key === "Enter") {
				event.preventDefault();
				onSaveNewName();
			}
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter" && isFocusing) {
				onStartEditingName();
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
			window.addEventListener("keydown", onKeyDown);
			window.addEventListener("mousedown", onClickOutside);
			return () => {
				window.removeEventListener("keydown", onKeyDown);
				window.removeEventListener("mousedown", onClickOutside);
			};
		}, [isEditing, name, isFocusing, contentRef]);

		useImperativeHandle(
			ref,
			() => ({
				isFocusing,
				setIsFocusing,
				onStartEditingName,
			}),
			[isFocusing, setIsFocusing, onStartEditingName]
		);

		const renderInput = () => (
			<input
				ref={inputRef}
				className="ffs__name-input"
				value={name}
				onKeyDown={onKeyDownInInput}
				onChange={(e) => setName(e.target.value)}
			/>
		);

		const renderNameDisplay = () => (
			<div
				ref={eleRef}
				className={classNames("ffs__name", className, {
					"ffs__name--bold": boldName,
				})}
			>
				{name}
			</div>
		);

		return isEditing ? renderInput() : renderNameDisplay();
	}
);

export default EditableName;
