import classNames from "classnames";
import { TFile } from "obsidian";
import { forwardRef, RefObject, useRef } from "react";

import { useExplorer } from "src/hooks/useExplorer";
import {
	useFileItemSpacing,
	useShowFileDetail,
} from "src/hooks/useSettingsHandler";
import { FILE_ITEM_SPACING } from "src/settings";

import { NameRef } from "../EditableName";

import FileDetail from "./Detail";
import FileExtension from "./Extension";
import FileName from "./Name";

type Props = {
	file: TFile;
};
const FileContentInner = forwardRef(
	({ file }: Props, ref: RefObject<NameRef>) => {
		const { plugin } = useExplorer();
		const { settings } = plugin;

		const { showFileDetail: showDetail, fileItemSpacing: spacing } =
			settings;
		const { showFileDetail } = useShowFileDetail(showDetail);
		const { fileItemSpacing } = useFileItemSpacing(spacing);

		const contentRef = useRef<HTMLDivElement>(null)

		const maybeRenderFileDetail = () => {
			if (!showFileDetail) return null;
			return <FileDetail file={file} />;
		};

		const getClassNames = () => {
			return classNames(
				"ffs__file-content-header tree-item-inner nav-file-title-content",
				{
					"ffs__file-content-header--comfortable":
						fileItemSpacing === FILE_ITEM_SPACING.COMFORTABLE,
					"ffs__file-content-header--with-detail": showFileDetail,
				}
			);
		};

		return (
			<div className={getClassNames()} ref={contentRef}>
				<div className="ffs__file-content-title">
					<FileName file={file} ref={ref} contentRef={contentRef} />
					<FileExtension file={file} />
				</div>
				{maybeRenderFileDetail()}
			</div>
		);
	}
);

export default FileContentInner;
