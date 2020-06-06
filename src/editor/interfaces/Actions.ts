import { Transaction, EditorState } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { MenuActions } from "./MenuActions";

export type Dispatch = (t: Transaction) => any;

export type ActionDeclaration<A extends Array<any>> = (...a: A) => (s: EditorState, dispatch: Dispatch) => any;

export type ActionDeclarations = {
	[k: string]: ActionDeclaration<any>
};

export type Actions<T extends ActionDeclarations> = {
	[k in keyof T]: (...a: Parameters<T[k]>) => any
};

export type GetMenuActions<T extends ActionDeclarations> = (schema: Schema) => T;

type Fun<A extends Array<any>> = (...args: A) => any;

export type MenuActionDeclarations<T extends keyof MenuActions> = {
	[A in keyof MenuActions[T]]: MenuActions[T][A] extends Fun<infer Args>
		? ActionDeclaration<Args>
		: never;
}