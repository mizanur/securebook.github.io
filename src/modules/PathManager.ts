import { PathManager as IPathManager } from "@interfaces/PathManager";
import { LocationManager } from "@interfaces/LocationManager";
import { AuthURLStorage } from "@interfaces/AuthURLStorage";

export class PathManager implements IPathManager {
	private readonly locationManager: LocationManager;
	private readonly authURLStorage: AuthURLStorage;

	constructor(locationManager: LocationManager, authURLStorage: AuthURLStorage) {
		this.locationManager = locationManager;
		this.authURLStorage = authURLStorage;
	}

	onAuthCompleted() {
		this.authURLStorage.restoreURL();
	}

	onNoteSelected(id: string | null) {
		if (id) {
			this.locationManager.push(`/#note=${id}`);
		}
		else {
			this.locationManager.push(`/`);
		}
	}
}