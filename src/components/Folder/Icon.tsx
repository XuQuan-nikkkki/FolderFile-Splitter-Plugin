import classNames from "classnames";
import { TFolder } from "obsidian";

import { FolderIcon as FolderIconSvg, StarIcon } from "src/assets/icons";
import { useExplorer } from "src/hooks/useExplorer";
import { useShowFolderIcon } from "src/hooks/useSettingsHandler";

export type FolderProps = {
	folder: TFolder;
};
type Props = FolderProps;
const FolderIcon = ({ folder }: Props) => {
	const { plugin } = useExplorer();

	const isRoot = folder.isRoot();

	const { settings } = plugin;
	const { showFolderIcon } = useShowFolderIcon(settings.showFolderIcon);

	if (!showFolderIcon) return null;
	const className = classNames("ffs__folder-icon", {
		"ffs__folder-icon--root": isRoot,
	});

	return (
		<div className="ffs__folder-icon-wrapper">
			{isRoot ? (
				<StarIcon className={className} />
			) : (
				<FolderIconSvg className={className} />
			)}
		</div>
	);
};

export default FolderIcon;
