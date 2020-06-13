import { PassStorage as IPassStorage } from "@interfaces/PassStorage";

export class PassStorage implements IPassStorage {
	get() {
		return window.localStorage.getItem('notesPassword');
	}

	set(pwd: string) {
		window.localStorage.setItem('notesPassword', pwd);
	}

	delete() {
		window.localStorage.removeItem('notesPassword');
	}
}