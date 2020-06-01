import { Transaction, EditorState } from "prosemirror-state";
import { EditorSchema } from "@editor/EditorSchema";

export type Dispatch = (t: Transaction) => any;

export type ActionDeclaration<A extends Array<any>> = (...a: A) => (s: EditorState, dispatchTransaction: Dispatch) => any;

export type ActionDeclarations = {
	[k: string]: ActionDeclaration<any>
};

export type Actions<T extends ActionDeclarations> = {
	[k in keyof T]: (...a: Parameters<T[k]>) => any
};

export type AddMenuActions<T extends ActionDeclarations> = (schema: EditorSchema['schema']) => T;