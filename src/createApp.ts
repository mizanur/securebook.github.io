import { connectFactory } from "typeconnect";
import { createParts } from "@data/createParts";
import { createBusiness } from "@data/createBusiness";
import { PartsManager } from "@modules/PartsManager";
import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";

export function createApp(): [Store, Managers] {
	const createPartsConn = connectFactory(createParts);
	const createBusinessConn = connectFactory(createBusiness);

	const parts = createPartsConn();
	const business = createBusinessConn(parts);
	const partsManager = new PartsManager(parts);
	
	return [
		{
			parts,
			business
		},
		{
			parts: partsManager
		}
	]
}