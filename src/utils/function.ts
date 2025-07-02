export type Noop = () => void;
export type AsyncNoop = () => Promise<void>;

export const noop = () => {};
