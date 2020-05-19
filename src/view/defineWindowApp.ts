import { Store } from "@interfaces/Store";
import { Managers } from "@interfaces/Managers";

export function defineWindowApp(store: Store, managers: Managers) {
	if (process.env.NODE_ENV === 'development') {
		Object.defineProperty(window, 'store', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: store
		});
		Object.defineProperty(window, 'managers', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: managers
		});
	}
}