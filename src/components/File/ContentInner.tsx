import classNames from "classnames";
import { TFile } from "obsidian";
import { forwardRef, RefObject } from "react";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useFileItemSpacing,
	useShowFileDetail,
} from "src/hooks/useSettingsHandler";

import { FileInnerContentRef } from "./Content";
import FileDetail from "./Detail";
import FileExtension from "./Extension";
import FileName from "./Name";

export type Props = {
	file: TFile;
	fileRef: RefObject<HTMLDivElement | null>;
};
const FileContentInner = forwardRef(
	(
		{ file, fileRef }: Props,
		ref: React.ForwardedRef<FileInnerContentRef>
	) => {
		const { plugin } = useExplorer();
		const { settings } = plugin;

		const { showFileDetail: showDetail, fileItemSpacing: spacing } =
			settings;
		const { showFileDetail } = useShowFileDetail(showDetail);
		const { fileItemSpacing } = useFileItemSpacing(spacing);

		const maybeRenderFileDetail = () => {
			if (!showFileDetail) return null;
			return <FileDetail file={file} />;
		};

		const getClassNames = () => {
			return classNames(
				"ffs__file-content-header tree-item-inner nav-file-title-content",
				{
					"ffs__file-content-header--comfortable":
						fileItemSpacing === "Comfortable",
					"ffs__file-content-header--with-detail": showFileDetail,
				}
			);
		};

		return (
			<div className={getClassNames()}>
				<div className="ffs__file-content-title">
					<FileName file={file} ref={ref} fileRef={fileRef} />
					<FileExtension file={file} />
				</div>
				{maybeRenderFileDetail()}
			</div>
		);
	}
);

export default FileContentInner;
