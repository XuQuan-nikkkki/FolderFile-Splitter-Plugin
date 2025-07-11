import { forwardRef, RefObject } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";
import { TagNode } from "src/store/tag";

import EditableName, { NameRef } from "../EditableName";

export type FolderProps = {
	tag: TagNode;
	contentRef: RefObject<HTMLDivElement | null>;
};
type Props = FolderProps;
const TagName = forwardRef(
	({ tag, contentRef }: Props, ref: RefObject<NameRef>) => {
		const { useExplorerStore } = useExplorer();

		const { renameTag, isFocusedTag } = useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				renameTag: store.renameTag,
				isFocusedTag: store.isFocusedTag,
			}))
		);

		return (
			<EditableName
				ref={ref}
				isFocused={isFocusedTag(tag)}
				contentRef={contentRef}
				defaultName={tag.name}
				className="ffs__tag-name"
				onSaveName={async (name: string) => await renameTag(tag, name)}
			/>
		);
	}
);

export default TagName;
