import { LocationManager as ILocationManager } from "@interfaces/LocationManager";
import { Location } from "@interfaces/Location";

export class LocationManager implements ILocationManager {
	private readonly location: Location;

	constructor(location: Location) {
		this.location = location;
		window.addEventListener('popstate', this.onLocationChange);
	}

	private onLocationChange = () => {
		this.location.location = { ...window.location };
	}
	
	push(url: string) {
		window.history.pushState(null, "", url);
		this.onLocationChange();
	}

	replace(url: string) {
		window.history.replaceState(null, "", url);
		this.onLocationChange();
	}

	go(steps: number) {
		window.history.go(steps);
		this.onLocationChange();
	}

	goBack() {
		window.history.back();
		this.onLocationChange();
	}

	goForward() {
		window.history.forward();
		this.onLocationChange();
	}

	redirect(url: string) {
		window.location.href = url;
	}
}