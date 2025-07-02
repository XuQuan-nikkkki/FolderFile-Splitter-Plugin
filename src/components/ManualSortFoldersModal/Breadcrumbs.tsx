import { TFolder } from "obsidian";
import { Fragment } from "react";
import { useShallow } from "zustand/react/shallow";

import { useExplorer } from "src/hooks/useExplorer";
import { ExplorerStore } from "src/store";

import FolderBreadcrumb from "./Breadcrumb";

type Props = {
	folder: TFolder | null;
	setFolder: (folder: TFolder | null) => void;
};
const FoldersBreadcrumbs = ({ folder, setFolder }: Props) => {
	const { useExplorerStore } = useExplorer();

	const { getFolderAncestors } = useExplorerStore(
		useShallow((store: ExplorerStore) => ({
			getFolderAncestors: store.getFolderAncestors,
		}))
	);

	if (!folder) return null;

	const renderSlashSign = () => <span> / </span>;

	const folders = folder.isRoot()
		? [folder]
		: getFolderAncestors(folder, true);
	return (
		<>
			{folders.map((f, index) => {
				return (
					<Fragment key={f.path}>
						{index > 0 && renderSlashSign()}
						<FolderBreadcrumb
							key={f.path}
							folder={f}
							setFolder={setFolder}
							disabled={folder.path === f.path}
						/>
					</Fragment>
				);
			})}
		</>
	);
};

export default FoldersBreadcrumbs;
