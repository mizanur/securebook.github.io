import { EditorState } from "prosemirror-state";
import { Dispatch } from "@editor/interfaces/Actions";
import { EditorView } from "prosemirror-view";

export type EditorCommand = (state: EditorState, dispatch: Dispatch, view: EditorView) => boolean;