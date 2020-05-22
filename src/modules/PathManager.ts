import { PathManager as IPathManager } from "@interfaces/PathManager";
import { LocationManager } from "@interfaces/LocationManager";

export class PathManager implements IPathManager {
	private readonly locationManager: LocationManager;

	constructor(locationManager: LocationManager) {
		this.locationManager = locationManager;
	}

	onAuthCompleted() {
		this.locationManager.replace("/");
	}
}