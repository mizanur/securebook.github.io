import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

export type EditorCurrentState = {
	exists: false,
	view: null | EditorView,
	state: null | EditorState,
} | {
	exists: true,
	view: EditorView,
	state: EditorState,
};