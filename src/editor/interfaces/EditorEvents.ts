import { EditorState, Transaction } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

export type PerformCommand = (cmd: (state: EditorState, dispatch: (t: Transaction) => any) => any) => void;

export interface EditorEvents {
	addEditorEvents(root: HTMLElement, schema: Schema, performCommand: PerformCommand, viewRef: { current: EditorView }): void | (() => void);
}