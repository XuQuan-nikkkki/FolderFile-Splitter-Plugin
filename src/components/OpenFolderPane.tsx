import { PanelRightClose } from "src/assets/icons";
import StyledActionIconWrapper from "./Styled/ActionIconWrapper";

type Props = {
	onOpen: () => void;
};
const OpenFolderPane = ({ onOpen }: Props) => {
	return (
		<StyledActionIconWrapper onClick={onOpen}>
			<PanelRightClose />
		</StyledActionIconWrapper>
	);
};

export default OpenFolderPane;
