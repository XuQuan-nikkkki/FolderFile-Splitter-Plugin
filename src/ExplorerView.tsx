import { Root, createRoot } from "react-dom/client";
import { ItemView, WorkspaceLeaf } from "obsidian";
import styled from "styled-components";

import FolderFileSplitterPlugin from "./main";
import Explorer from "./components/Explorer";

const StyledExplorerContainer = styled.div.attrs({
	className: "ffs__plugin-container",
})`
	height: 100%;
`;

export class ExplorerView extends ItemView {
	root: Root;
	plugin: FolderFileSplitterPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: FolderFileSplitterPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return this.plugin?.VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.plugin?.VIEW_DISPLAY_TEXT;
	}

	getIcon(): string {
		return this.plugin?.ICON;
	}

	destroy() {
		this.root?.unmount();
	}

	async onOpen(): Promise<void> {
		this.destroy();
		this.constructFileTree(this.app.vault.getRoot().path, "");
	}

	constructFileTree(folderPath: string, vaultChange: string) {
		this.destroy();
		this.root = createRoot(this.contentEl);
		this.root.render(
			<StyledExplorerContainer>
				<Explorer plugin={this.plugin} />
			</StyledExplorerContainer>
		);
	}
}
