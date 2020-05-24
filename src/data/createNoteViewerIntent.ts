import { Location } from "@interfaces/Location";

export function createNoteViewerIntent(location: Location) {
	return {
		isCurrentIntentValid: false,

		get isCurrentIntent() {
			return !location.query.page;
		}
	}
}