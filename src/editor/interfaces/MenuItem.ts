import { MenuState } from "@editor/interfaces/MenuState";
import { MenuActions } from "@editor/interfaces//MenuActions";
import { Schema } from "prosemirror-model";
import { MenuActionDeclarations } from "@editor/interfaces/Actions";
import { EditorCurrentState } from "@editor/interfaces/EditorCurrentState";

export interface MenuStateItem<T extends keyof MenuState> {
	name: T,
	getMenuState(state: EditorCurrentState, schema: Schema): MenuState[T];
}

export interface MenuActionItem<T extends keyof MenuActions> {
	name: T,
	getMenuActions(schema: Schema): MenuActionDeclarations<T>;
}