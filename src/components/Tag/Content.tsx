import { useShowTagIcon } from "src/hooks/useSettingsHandler";
import { useExplorer } from "src/hooks/useExplorer";
import classNames from "classnames";
import { TagIcon } from "src/assets/icons";
import { TagNode } from "src/store/tag";
import FilesCount from "./FilesCount";

type Props = {
	tag: TagNode;
};
const TagContent = ({ tag }: Props) => {
	const { plugin } = useExplorer();

	const { showTagIcon } = useShowTagIcon(plugin.settings.showTagIcon);

	const maybeRenderTagIcon = () => {
		if (!showTagIcon) return null;
		const className = classNames("ffs__tag-icon");

		return (
			<div className="ffs__tag-icon-wrapper">
				<TagIcon className={className} />
			</div>
		);
	};

	const renderTitleContent = () => (
		<div className="ffs__tag-content--main">
			{maybeRenderTagIcon()}
			{tag.name}
			<FilesCount tag={tag} />
		</div>
	);

	return <div className={classNames("ffs__tag")}>{renderTitleContent()}</div>;
};

export default TagContent;
