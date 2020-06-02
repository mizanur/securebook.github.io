import { Transaction, EditorState } from "prosemirror-state";
import { Schema } from "prosemirror-model";

export type Dispatch = (t: Transaction) => any;

export type ActionDeclaration<A extends Array<any>> = (...a: A) => (s: EditorState, dispatchTransaction: Dispatch) => any;

export type ActionDeclarations = {
	[k: string]: ActionDeclaration<any>
};

export type Actions<T extends ActionDeclarations> = {
	[k in keyof T]: (...a: Parameters<T[k]>) => any
};

export type AddMenuActions<T extends ActionDeclarations> = (schema: Schema) => T;