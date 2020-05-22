import { createParts } from "@data/createParts";
import { createBusiness } from "@data/createBusiness";
import { createRenderer } from "@data/createRenderer";

export interface Connected {
	createParts: typeof createParts,
	createBusiness: typeof createBusiness,
	createRenderer: typeof createRenderer,
}