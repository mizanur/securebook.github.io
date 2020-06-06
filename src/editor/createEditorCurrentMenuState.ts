import { EditorCurrentState } from "./interfaces/EditorCurrentState";
import { EditorCurrentMenuState } from "./interfaces/EditorCurrentMenuState";
import { MenuStateItem, MenuActionItem } from "./interfaces/MenuItem";
import { MenuState } from "./interfaces/MenuState";
import { MenuActions } from "./interfaces/MenuActions";
import { Schema } from "prosemirror-model";
import { GetMenuActions, Actions, ActionDeclarations, Dispatch } from "./interfaces/Actions";
import { EditorState } from "prosemirror-state";

export function createEditorCurrentMenuState<
	S extends Array<MenuStateItem<keyof MenuState>>,
	A extends Array<MenuActionItem<keyof MenuActions>>,
>(
	editorCurrentState: EditorCurrentState,
	menuStateItems: S,
	menuActionsItems: A,
	schema: Schema,
): EditorCurrentMenuState {

	let state: EditorState;
	let dispatch: Dispatch;

	function createActions<T extends ActionDeclarations>(fun: GetMenuActions<T>) {
		const actions: Actions<T> = {} as Actions<T>;
		const actionDeclarations = fun(schema);
		for (const key in actionDeclarations) {
			actions[key] = (...args: any) => {
				actionDeclarations[key](...args)(state, dispatch);
			};
		}
		return actions;
	}

	return <EditorCurrentMenuState> {
		savePassiveState() {
			if (editorCurrentState.exists) {
				state = editorCurrentState.state;
				dispatch = editorCurrentState.view.dispatch;
			}
		},

		get state() {
			if (!editorCurrentState.exists) {
				return null;
			}
			const menuState = {} as MenuState;
			for (let i = 0; i < menuStateItems.length; i++) {
				const menuStateItem: MenuStateItem<any> = menuStateItems[i];
				menuState[menuStateItem.name] = menuStateItem.getMenuState(editorCurrentState.state, schema);
			}
			return menuState;
		},

		get actions() {
			if (!editorCurrentState.exists) {
				console.log('actions removed');
				return null;
			}
			console.log('actions created');
			const menuActions = {} as MenuActions;
			for (let i = 0; i < menuActionsItems.length; i++) {
				const menuActionItem: MenuActionItem<any> = menuActionsItems[i];
				menuActions[menuActionItem.name] = createActions(menuActionItem.getMenuActions);
			}
			return menuActions;
		},

		get exists() {
			return !!this.state && !!this.actions;
		},
	};
};