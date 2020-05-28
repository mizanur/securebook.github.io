import { createContext, ComponentChildren } from "preact";

export type PortalValue = {
	childrenStore: { [k: string]: ComponentChildren },
	updateChildren: () => void,
};

export const PortalValueContext = createContext({} as unknown as PortalValue);