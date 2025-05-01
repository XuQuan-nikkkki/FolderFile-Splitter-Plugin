import classNames from "classnames";
import { TagNode } from "src/store/tag";

type Props = {
	tag: TagNode;
};
const Tag = ({ tag }: Props) => {
	return (
		<div
			className={classNames(
				"ffs__folder-container tree-item-self nav-tag-title is-clickable"
			)}
		>
			{tag.name}
		</div>
	);
};

export default Tag;
