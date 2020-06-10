import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";

export type EditorActiveState = {
	exists: true,
	view: EditorView,
	state: EditorState,
};

export type EditorCurrentState = {
	exists: false,
	view: null | EditorView,
	state: null | EditorState,
} | EditorActiveState;