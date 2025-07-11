import { TFile } from "obsidian";
import { forwardRef, RefObject, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { useBoldFileTitle } from "src/hooks/useSettingsHandler";
import { ExplorerStore } from "src/store";
import { UNTITLED_NAME } from "src/utils";

import EditableName, { NameRef } from "../EditableName";

type Props = {
	file: TFile
	contentRef: RefObject<HTMLDivElement | null>
}
const FileName = forwardRef(
	({ file, contentRef }: Props, ref: RefObject<NameRef>) => {
		const { useExplorerStore, plugin } = useExplorer();
		const { settings } = plugin;

		const { renameFile, isFocusedFile } = useExplorerStore(
			useShallow((store: ExplorerStore) => ({
				renameFile: store.renameFile,
				isFocusedFile: store.isFocusedFile,
			}))
		);

		const { boldFileTitle } = useBoldFileTitle(settings.boldFileTitle);

		useEffect(() => {
			const now = Date.now();
			const fileCreateTime = file.stat.ctime;
			if (
				now - fileCreateTime < 3000 &&
				file.name.includes(UNTITLED_NAME)
			) {
				ref.current?.onStartEditingName();
			}
		}, []);

		return (
			<EditableName
				ref={ref}
				contentRef={contentRef}
				defaultName={file.basename}
				onSaveName={async (name: string) =>
					await renameFile(file, name)
				}
				className="ffs__file-name"
				boldName={boldFileTitle}
				isFocused={isFocusedFile(file)}
			/>
		);
	}
);

export default FileName;
