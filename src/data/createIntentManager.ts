import { Intent } from "@interfaces/Intent";

export function createIntentManager(intents: Intent[]) {
	return {
		determineAndNotifyValidIntent() {
			let isCurrentIntentDetected = false;
			for (let i = 0; i < intents.length; i++) {
				const intent = intents[i];
				if (!isCurrentIntentDetected && intent.isCurrentIntent) {
					intent.isCurrentIntentValid = true;
					isCurrentIntentDetected = true;
				}
				else {
					intent.isCurrentIntentValid = false;
				}
			}
		}
	}
}