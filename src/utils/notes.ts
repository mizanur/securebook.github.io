import { Note } from "@interfaces/Notes";

const unsavedChangesString = `There are unsaved changes. If you leave without saving, they will be lost. Are you sure?`;

export function isConfirmedUnsavedChanges() {
	if (window.confirm(unsavedChangesString)) {
		return true;
	}
	return false;
}

export function unsavedChangesListener(e: BeforeUnloadEvent) {
	(e || window.event).returnValue = unsavedChangesString;
	return unsavedChangesString;
}

export function orderByUpdatedDate(notes: Note[], isAsc = false): Note[] {
	const result = [...notes];
	result.sort((a, b) => isAsc
		? a.lastUpdatedTime - b.lastUpdatedTime
		: b.lastUpdatedTime - a.lastUpdatedTime);
	return result;
}