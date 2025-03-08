import { Root, createRoot } from "react-dom/client";
import { ItemView, WorkspaceLeaf } from "obsidian";
import styled from "styled-components";

import FolderFileSplitterPlugin from "./main";
import FileTree, {
	FILES_PANE_MIN_WIDTH,
	FOLDERS_PANE_MIN_WIDTH,
} from "./components/FileTree";

const PluginView = styled.div`
	height: 100%;
	min-width: calc(
		var(${FOLDERS_PANE_MIN_WIDTH}px) + var(${FILES_PANE_MIN_WIDTH}px)
	);
`;

export class FileTreeView extends ItemView {
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
			<PluginView>
				<FileTree plugin={this.plugin} />
			</PluginView>
		);
	}
}
