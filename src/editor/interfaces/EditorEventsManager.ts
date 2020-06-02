import { Schema } from "prosemirror-model";
import { PerformCommand } from "@editor/interfaces/EditorEvents";
import { EditorView } from "prosemirror-view";

export interface  EditorEventsManager {
	addEditorEvents(root: HTMLElement, schema: Schema, performCommand: PerformCommand, viewRef: { current: EditorView }): void;
	removeEditorEvents(): void;
}