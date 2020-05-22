import { Intent } from "@interfaces/Intent";

export interface IntentManager {
	currentIntent: Intent | null;
}