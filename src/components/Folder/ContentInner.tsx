import { TFolder } from "obsidian";
import { ForwardedRef, forwardRef, Ref } from "react";

import { FolderNameRef } from "./Content";
import FolderFilesCount from "./FilesCount";
import FolderIcon from "./Icon";
import FolderName from "./Name";

export type FolderProps = {
	folder: TFolder;
	nameRef: Ref<FolderNameRef>
};
type Props = FolderProps;
const FolderContentInner = forwardRef(
	({ folder, nameRef }: Props, ref: ForwardedRef<HTMLDivElement | null>) => {

		return (
			<div ref={ref} className="ffs__folder-content--main">
				<FolderIcon folder={folder} />
				<FolderName folder={folder} ref={nameRef} />
				<FolderFilesCount folder={folder} />
			</div>
		);
	}
);

export default FolderContentInner;
