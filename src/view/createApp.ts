import { connectFactory } from "typeconnect";
import { createParts } from "@data/createParts";
import { createBusiness } from "@data/createBusiness";
import { PartsManager } from "@modules/PartsManager";
import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";
import { Connected } from "@interfaces/Connected";
import { createRenderer } from "@data/createRenderer";
import { Crypter } from "@view/Crypter";

export function createApp(): [Connected, Store, Managers] {
	const connected = {
		createParts: connectFactory(createParts),
		createBusiness: connectFactory(createBusiness),
		createRenderer: connectFactory(createRenderer),
	};

	const parts = connected.createParts();
	const business = connected.createBusiness(parts);
	const partsManager = new PartsManager(parts);
	const crypter = new Crypter();
	
	return [
		connected,
		{
			parts,
			business
		},
		{
			partsManager,
			crypter,
		}
	]
}