import { ActionDeclarations, AddMenuActions, Actions } from "@editor/interfaces/Actions";
import { EditorSchema } from "@editor/interfaces/EditorSchema";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState, Transaction } from "prosemirror-state";

export function getCreateActions(editorSchema: EditorSchema, state: Wrapped<EditorState>, dispatch: (t: Transaction) => any) {
	return function createActions<T extends ActionDeclarations>(fun: AddMenuActions<T>) {
		const actions: Actions<T> = {} as Actions<T>;
		const actionDeclarations = fun(editorSchema.schema);
		for (const key in actionDeclarations) {
			actions[key] = (...args: any) => {
				actionDeclarations[key](...args)(state.value, dispatch);
			};
		}
		return actions;
	}
};