import { EditorEventsManager as IEditorEventsManager } from "@editor/interfaces/EditorEventsManager";
import { EditorEvents, PerformCommand } from "@editor/interfaces/EditorEvents";
import { Schema } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

export class EditorEventsManager implements IEditorEventsManager {
	private readonly editorEvents: EditorEvents[];
	private editorEventCleanups: Array<() => void>;	

	constructor(editorEvents: EditorEvents[]) {
		this.editorEvents = editorEvents;
		this.editorEventCleanups = [];
	}

	addEditorEvents(root: HTMLElement, schema: Schema, performCommand: PerformCommand, viewRef: { current: EditorView }) {
		for (let i = 0; i < this.editorEvents.length; i++) {
			const result = this.editorEvents[i].addEditorEvents(root, schema, performCommand, viewRef);

			if (result) {
				this.editorEventCleanups.push(result);
			}
		}
	}

	removeEditorEvents() {
		for (let i = 0; i < this.editorEventCleanups.length; i++) {
			this.editorEventCleanups[i]();
		}
		this.editorEventCleanups = [];
	}
}