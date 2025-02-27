import { PanelRightCloseIcon } from "src/assets/icons";

type Props = {
  onOpenFilesPane: () => void;
};
const OpenFilesPane = ({  onOpenFilesPane }: Props) => {
	return (
		<div className="ffs-actions-icon-wrapper" onClick={onOpenFilesPane}>
			<PanelRightCloseIcon />
		</div>
	);
};

export default OpenFilesPane;
