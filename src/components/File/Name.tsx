import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import useRenderEditableName from "src/hooks/useRenderEditableName";
import { useBoldFileTitle } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { UNTITLED_NAME } from "src/utils";

import { FileInnerContentRef } from "./Content";
import { Props } from "./ContentInner";

const FileName = forwardRef(
	(
		{ file, fileRef }: Props,
		ref: React.ForwardedRef<FileInnerContentRef>
	) => {
		const { useExplorerStore, plugin } = useExplorer();
		const { settings } = plugin;

		const { renameFile } = useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				renameFile: store.renameFile,
			}))
		);

		const { boldFileTitle } = useBoldFileTitle(settings.boldFileTitle);

		useImperativeHandle(ref, () => ({
			setIsFocusing,
			onStartEditingName,
		}));

		const onSaveName = (name: string) => renameFile(file, name);

		const { renderEditableName: renderFileName, onStartEditingName } =
			useRenderEditableName(file.basename, onSaveName, {
				className: "ffs__file-name",
				bold: boldFileTitle,
			});

		const [isFocusing, setIsFocusing] = useState<boolean>(false);

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter" && isFocusing) {
				onStartEditingName();
			}
		};

		const onClickOutside = (event: MouseEvent) => {
			if (
				fileRef.current &&
				!fileRef.current.contains(event.target as Node)
			) {
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
		}, [isFocusing]);

		useEffect(() => {
			const now = Date.now();
			const fileCreateTime = file.stat.ctime;
			if (now - fileCreateTime < 3000 && file.name.includes(UNTITLED_NAME)) {
				onStartEditingName();
			}
		}, []);

		return renderFileName();
	}
);

export default FileName;
