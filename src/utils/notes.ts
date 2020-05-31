import { Note } from "@interfaces/Notes";

export function orderByUpdatedDate(notes: Note[], isAsc = false): Note[] {
	const result = [...notes];
	result.sort((a, b) => isAsc
		? a.lastUpdatedTime - b.lastUpdatedTime
		: b.lastUpdatedTime - a.lastUpdatedTime);
	return result;
}