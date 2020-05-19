import { connect, configureConnect } from "typeconnect";
import { Parts } from "@data/Parts";
import { Business } from "@data/Business";
import { PartsManager } from "@modules/PartsManager";
import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";

export function createApp(): [Store, Managers] {
	const PartsConn = connect(Parts);
	const BusinessConn = connect(Business);

	const parts = new PartsConn;
	const business = new BusinessConn(parts);
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