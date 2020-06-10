import { AuthURLStorage as IAuthURLStorage } from "@interfaces/AuthURLStorage";
import { Location } from "@interfaces/Location";
import { LocationManager } from "@interfaces/LocationManager";

export class AuthURLStorage implements IAuthURLStorage {
	private readonly location: Location;
	private readonly locationManager: LocationManager;

	constructor(location: Location, locationManager: LocationManager) {
		this.location = location;
		this.locationManager = locationManager;
	}

	storeURL() {
		const { location } = this.location;
		window.localStorage.setItem('authURL', location.pathname + location.search + location.hash);
	}

	restoreURL() {
		const url = window.localStorage.getItem('authURL');
		if (url) {
			this.locationManager.replace(url);
		}
		else {
			this.locationManager.replace(`/`);
		}
		window.localStorage.removeItem('authURL');
	}
}