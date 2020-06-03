import { createContext, ComponentChildren } from "preact";

export type PortalValue = {
	currentId: number,
	childrenStore: { [k: string]: ComponentChildren },
	updateChildren: () => void,
};

export const PortalValueContext = createContext({} as unknown as PortalValue);