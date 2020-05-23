import { Location } from "@interfaces/Location";

export function createBookSelectIntent(location: Location) {
	return {
		isCurrentIntentValid: false,

		get isCurrentIntent() {
			return !location.query.page;
		}
	}
}