import { Schema } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";

export type EditorCommand = (state: EditorState<Schema>, dispatch?: ((p: Transaction<Schema>) => void) | undefined) => boolean;