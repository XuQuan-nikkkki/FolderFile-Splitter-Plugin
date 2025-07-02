import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TAbstractFile } from "obsidian";
import { HTMLAttributes, ReactNode } from "react";

type UseSortItemProps = {
	id: string;
	item: TAbstractFile;
	type: string;
};
export const useSortItem = ({ id, item, type }: UseSortItemProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data: { item, type },
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return {
		attributes,
		style,
		setNodeRef,
		listeners,
	};
};

type Props = UseSortItemProps & {
	children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;
export const ItemToSort = ({ id, item, type, children, ...props }: Props) => {
	const { attributes, listeners, style, setNodeRef } = useSortItem({
		id,
		item,
		type,
	});
	return (
		<div
			ref={setNodeRef}
			id={id}
			style={style}
			{...attributes}
			{...listeners}
			{...props}
		>
			{children}
		</div>
	);
};
