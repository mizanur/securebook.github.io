import { MenuState } from "@editor/interfaces/MenuState";
import { MenuActions } from "@editor/interfaces//MenuActions";
import { EditorState } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { MenuActionDeclarations } from "./Actions";

export interface MenuStateItem<T extends keyof MenuState> {
	name: T,
	getMenuState(state: EditorState, schema: Schema): MenuState[T];
}

export interface MenuActionItem<T extends keyof MenuActions> {
	name: T,
	getMenuActions(schema: Schema): MenuActionDeclarations<T>;
}