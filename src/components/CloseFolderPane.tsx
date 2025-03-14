import { PanelRightOpen } from "src/assets/icons";
import StyledActionIconWrapper from "./Styled/ActionIconWrapper";

type Props = {
	onClose: () => void;
};
const CloseFolderPane = ({ onClose }: Props) => {
	return (
		<StyledActionIconWrapper onClick={onClose}>
			<PanelRightOpen />
		</StyledActionIconWrapper>
	);
};

export default CloseFolderPane;
