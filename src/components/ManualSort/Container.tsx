import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TAbstractFile } from "obsidian";
import { ReactNode, useState } from "react";

type Props = {
	items: string[];
	changeOrder: (item: TAbstractFile, atIndex: number) => Promise<void>;
	children: ReactNode;
	renderOverlay: (item: TAbstractFile | null) => ReactNode;
	breadcrumbs?: ReactNode;
};
const ManualSortContainer = ({
	items,
	changeOrder,
	renderOverlay,
	breadcrumbs,
	children,
}: Props) => {
	const [activeItem, setActiveItem] = useState<TAbstractFile | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const onDragStart = (event: DragStartEvent) => {
		setActiveItem(event.active.data.current?.item as TAbstractFile);
	};

	const onDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			if (!activeItem) return;
			const atIndex = items.findIndex((path) => path === over.id);
			return await changeOrder(activeItem, atIndex);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<div className="ffs__manual-sort-container">
				{breadcrumbs}
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					<div className="ffs__manual-sort-list">{children}</div>
				</SortableContext>
			</div>
			<DragOverlay>{renderOverlay(activeItem)}</DragOverlay>
		</DndContext>
	);
};

export default ManualSortContainer;
