import { createContext, useContext } from "react";
import { StoreApi, UseBoundStore } from "zustand";

import FolderFileSplitterPlugin from "src/main";
import { ExplorerStore } from "src/store";

export type ExplorerContextType = {
  useExplorerStore: UseBoundStore<StoreApi<ExplorerStore>>;
  plugin: FolderFileSplitterPlugin;
};
export const ExplorerContext = createContext<ExplorerContextType | null>(null);

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error("useExplorer must be used within a ExplorerProvider");
  }
  return context;
};