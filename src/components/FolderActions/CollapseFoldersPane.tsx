import { PanelRightOpenIcon } from "src/assets/icons";

type Props = {
  onCollapseFoldersPane: () => void;
};
const CollapseFoldersPane = ({  onCollapseFoldersPane }: Props) => {
	return (
		<div className="ffs-actions-icon-wrapper" onClick={onCollapseFoldersPane}>
			<PanelRightOpenIcon />
		</div>
	);
};

export default CollapseFoldersPane;
