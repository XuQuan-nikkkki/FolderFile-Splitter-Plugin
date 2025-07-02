import { TFolder } from "obsidian";
import { ForwardedRef, forwardRef, useRef } from "react";

import { FolderInnerContentRef } from "./Content";
import FolderFilesCount from "./FilesCount";
import FolderIcon from "./Icon";
import FolderName from "./Name";

export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps;
const FolderContentInner = forwardRef(
	({ folder }: Props, ref: ForwardedRef<FolderInnerContentRef>) => {
		const folderRef = useRef<HTMLDivElement>(null);

		return (
			<div ref={folderRef} className="ffs__folder-content--main">
				<FolderIcon folder={folder} />
				<FolderName folder={folder} ref={ref} />
				<FolderFilesCount folder={folder} />
			</div>
		);
	}
);

export default FolderContentInner;
