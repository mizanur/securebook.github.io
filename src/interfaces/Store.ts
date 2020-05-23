import { AuthData } from "@interfaces/AuthData";
import { Intents } from "@interfaces/Intents";

export interface Store {
	authData: AuthData;
	intents: Intents,
}