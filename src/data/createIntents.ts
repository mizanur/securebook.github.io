import { Intent } from "@interfaces/Intent";

export function createIntents(intents: Intent[]) {
	return {
		currentIntent: null as Intent | null,

		determineAndNotifyValidIntent() {
			let isCurrentIntentDetected = false;
			for (let i = 0; i < intents.length; i++) {
				const intent = intents[i];
				if (!isCurrentIntentDetected && intent.isCurrentIntent) {
					intent.isCurrentIntentValid = true;
					isCurrentIntentDetected = true;
					this.currentIntent = intent;
				}
				else {
					intent.isCurrentIntentValid = false;
				}
			}
			if (!isCurrentIntentDetected) {
				this.currentIntent = null;
			}
		}
	}
}